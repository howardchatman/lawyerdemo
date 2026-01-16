-- Chatman Legal Database Schema
-- All tables prefixed with 'lawyer_' to avoid conflicts

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS lawyer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'attorney', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cases table
CREATE TABLE IF NOT EXISTS lawyer_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  practice_area TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'intake' CHECK (status IN ('intake', 'active', 'pending', 'closed', 'won', 'settled')),
  client_id UUID NOT NULL REFERENCES lawyer_profiles(id) ON DELETE CASCADE,
  attorney_id UUID REFERENCES lawyer_profiles(id),
  next_hearing_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS lawyer_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES lawyer_cases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES lawyer_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS lawyer_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES lawyer_cases(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES lawyer_profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS lawyer_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES lawyer_cases(id) ON DELETE SET NULL,
  client_id UUID NOT NULL REFERENCES lawyer_profiles(id),
  attorney_id UUID NOT NULL REFERENCES lawyer_profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  location TEXT,
  meeting_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS lawyer_contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  practice_area TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  assigned_to UUID REFERENCES lawyer_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log for audit trail
CREATE TABLE IF NOT EXISTS lawyer_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES lawyer_profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lawyer_cases_client ON lawyer_cases(client_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_cases_attorney ON lawyer_cases(attorney_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_cases_status ON lawyer_cases(status);
CREATE INDEX IF NOT EXISTS idx_lawyer_documents_case ON lawyer_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_messages_case ON lawyer_messages(case_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_appointments_client ON lawyer_appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_appointments_attorney ON lawyer_appointments(attorney_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_contact_submissions_status ON lawyer_contact_submissions(status);

-- Row Level Security Policies
ALTER TABLE lawyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_contact_submissions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile, admins can view all
CREATE POLICY "Users can view own profile" ON lawyer_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON lawyer_profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM lawyer_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Attorneys can view client profiles" ON lawyer_profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM lawyer_profiles WHERE id = auth.uid() AND role IN ('attorney', 'admin'))
  );

CREATE POLICY "Users can update own profile" ON lawyer_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Cases: Clients see their cases, attorneys/admins see assigned or all
CREATE POLICY "Clients can view own cases" ON lawyer_cases
  FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Attorneys can view assigned cases" ON lawyer_cases
  FOR SELECT USING (attorney_id = auth.uid());

CREATE POLICY "Admins can view all cases" ON lawyer_cases
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM lawyer_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins and attorneys can insert cases" ON lawyer_cases
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM lawyer_profiles WHERE id = auth.uid() AND role IN ('admin', 'attorney'))
  );

CREATE POLICY "Admins and attorneys can update cases" ON lawyer_cases
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM lawyer_profiles WHERE id = auth.uid() AND role IN ('admin', 'attorney'))
  );

-- Documents: Based on case access
CREATE POLICY "Users can view documents for their cases" ON lawyer_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lawyer_cases
      WHERE lawyer_cases.id = lawyer_documents.case_id
      AND (lawyer_cases.client_id = auth.uid() OR lawyer_cases.attorney_id = auth.uid())
    )
  );

CREATE POLICY "Admins can view all documents" ON lawyer_documents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM lawyer_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Messages: Based on case access
CREATE POLICY "Users can view messages for their cases" ON lawyer_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lawyer_cases
      WHERE lawyer_cases.id = lawyer_messages.case_id
      AND (lawyer_cases.client_id = auth.uid() OR lawyer_cases.attorney_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages for their cases" ON lawyer_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM lawyer_cases
      WHERE lawyer_cases.id = case_id
      AND (lawyer_cases.client_id = auth.uid() OR lawyer_cases.attorney_id = auth.uid())
    )
  );

-- Appointments: Users see their appointments
CREATE POLICY "Clients can view own appointments" ON lawyer_appointments
  FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Attorneys can view their appointments" ON lawyer_appointments
  FOR SELECT USING (attorney_id = auth.uid());

CREATE POLICY "Admins can view all appointments" ON lawyer_appointments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM lawyer_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Contact submissions: Only admins and attorneys
CREATE POLICY "Staff can view contact submissions" ON lawyer_contact_submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM lawyer_profiles WHERE id = auth.uid() AND role IN ('admin', 'attorney'))
  );

CREATE POLICY "Anyone can insert contact submissions" ON lawyer_contact_submissions
  FOR INSERT WITH CHECK (true);

-- Function to auto-generate case numbers
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.case_number := 'CL-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('lawyer_case_number_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for case numbers
CREATE SEQUENCE IF NOT EXISTS lawyer_case_number_seq START 1;

-- Trigger to auto-generate case numbers
DROP TRIGGER IF EXISTS set_case_number ON lawyer_cases;
CREATE TRIGGER set_case_number
  BEFORE INSERT ON lawyer_cases
  FOR EACH ROW
  WHEN (NEW.case_number IS NULL OR NEW.case_number = '')
  EXECUTE FUNCTION generate_case_number();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_lawyer_profiles_updated_at
  BEFORE UPDATE ON lawyer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_lawyer_cases_updated_at
  BEFORE UPDATE ON lawyer_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
