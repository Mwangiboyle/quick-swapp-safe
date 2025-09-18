// src/components/DatabaseTest.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';

const DatabaseTest = () => {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const testResults: any = {};

    try {
      // Test 1: Check Supabase connection
      console.log('🔍 Testing Supabase connection...');
      const { data: connectionTest, error: connectionError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      testResults.connection = {
        success: !connectionError,
        error: connectionError?.message,
        data: connectionTest
      };

      // Test 2: Check current user
      console.log('🔍 Testing current user...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      testResults.currentUser = {
        success: !userError,
        error: userError?.message,
        user: user ? {
          id: user.id,
          email: user.email,
          metadata: user.user_metadata
        } : null
      };

      // Test 3: Check profiles table
      if (user) {
        console.log('🔍 Testing profiles table...');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        testResults.profile = {
          success: !profileError,
          error: profileError?.message,
          data: profile
        };

        // Test 4: Try to create profile if it doesn't exist
        if (profileError?.code === 'PGRST116') {
          console.log('🔧 Attempting to create missing profile...');
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                email: user.email!,
                first_name: user.user_metadata?.first_name || '',
                last_name: user.user_metadata?.last_name || '',
                university_domain: user.email!.split('@')[1],
                is_verified: false
              }
            ])
            .select()
            .single();
            
          testResults.profileCreation = {
            success: !createError,
            error: createError?.message,
            data: newProfile
          };
        }
      }

      // Test 5: Check categories table
      console.log('🔍 Testing categories table...');
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .limit(5);
      
      testResults.categories = {
        success: !categoriesError,
        error: categoriesError?.message,
        count: categories?.length || 0
      };

      // Test 6: Check items table
      console.log('🔍 Testing items table...');
      const { data: items, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .limit(5);
      
      testResults.items = {
        success: !itemsError,
        error: itemsError?.message,
        count: items?.length || 0
      };

    } catch (error) {
      console.error('❌ Test suite error:', error);
      testResults.generalError = error;
    }

    setResults(testResults);
    setLoading(false);
  };

  const TestResult = ({ title, result }: { title: string; result: any }) => (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${result?.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      {result?.error && (
        <p className="text-red-600 text-sm mb-2">Error: {result.error}</p>
      )}
      {result && (
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Database Connection Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={runTests} disabled={loading} className="mb-4">
          {loading ? 'Running Tests...' : 'Run Database Tests'}
        </Button>
        
        {Object.keys(results).length > 0 && (
          <div>
            <TestResult title="Supabase Connection" result={results.connection} />
            <TestResult title="Current User" result={results.currentUser} />
            <TestResult title="User Profile" result={results.profile} />
            {results.profileCreation && (
              <TestResult title="Profile Creation" result={results.profileCreation} />
            )}
            <TestResult title="Categories Table" result={results.categories} />
            <TestResult title="Items Table" result={results.items} />
            
            {results.generalError && (
              <div className="border border-red-300 rounded-lg p-4 bg-red-50">
                <h3 className="font-semibold text-red-700">General Error:</h3>
                <pre className="text-xs mt-2 overflow-auto">
                  {JSON.stringify(results.generalError, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseTest;
