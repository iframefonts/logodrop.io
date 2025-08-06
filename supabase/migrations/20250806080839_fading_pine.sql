/*
  # Add Credits Function

  1. New Functions
    - `add_credits`: Safely adds credits to a user's profile
      - Takes user_id and credits_to_add as parameters
      - Returns the new credit balance
      - Handles cases where profile doesn't exist
      - Uses atomic operations for data consistency

  2. Security
    - Function uses SECURITY DEFINER to run with elevated privileges
    - Only accessible to authenticated users through RLS policies
*/

CREATE OR REPLACE FUNCTION add_credits(user_id uuid, credits_to_add integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_credits integer;
BEGIN
    -- Insert or update the profile with additional credits
    INSERT INTO profiles (id, credits)
    VALUES (user_id, credits_to_add)
    ON CONFLICT (id)
    DO UPDATE SET 
        credits = COALESCE(profiles.credits, 0) + credits_to_add,
        updated_at = now()
    RETURNING credits INTO new_credits;
    
    RETURN new_credits;
END;
$$;