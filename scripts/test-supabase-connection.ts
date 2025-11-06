import { isSupabaseConfigured } from '../src/lib/server/supabase-storage';

/**
 * Test Supabase configuration
 */
async function testSupabaseConnection() {
	console.log('Testing Supabase configuration...');
	
	if (!isSupabaseConfigured()) {
		console.log('❌ Supabase is not configured');
		console.log('Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables');
		return;
	}
	
	console.log('✅ Supabase is configured');
	console.log('You can now use Supabase Storage for image uploads');
}

// Run test if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	testSupabaseConnection().catch(console.error);
}

export { testSupabaseConnection };
