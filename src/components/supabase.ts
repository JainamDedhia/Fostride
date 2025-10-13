import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://wyacdsybudwpmqcwybey.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5YWNkc3lidWR3cG1xY3d5YmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NjQ1OTksImV4cCI6MjA3MzQ0MDU5OX0.vsbEXn2l0kopPKkzyIexkMwy_BNzSStdW_RaeUiLla8"   // frontend uses anon key
export const supabase = createClient(supabaseUrl, supabaseKey)
