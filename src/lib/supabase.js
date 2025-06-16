import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uuyggfrfryfyiwtavplq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1eWdnZnJmcnlmeWl3dGF2cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNjY4NDksImV4cCI6MjA2NTY0Mjg0OX0.CeWMw0KvrQTtrUzHsuAJodkqH8g-qWuIst8JcxTWPFw'

export const supabase = createClient(supabaseUrl, supabaseKey)