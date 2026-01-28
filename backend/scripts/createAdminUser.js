import admin from '../config/firebaseAdmin.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdminUser() {
  try {
    console.log('\n=== Create Admin User ===\n');
    
    const email = await question('Enter admin email: ');
    const password = await question('Enter password (min 6 characters): ');
    
    if (!email || !password) {
      console.log('❌ Email and password are required');
      rl.close();
      return;
    }
    
    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters');
      rl.close();
      return;
    }
    
    console.log('\n⏳ Creating user...');
    
    // Create user
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      emailVerified: true, // Auto-verify email
      disabled: false
    });
    
    console.log('\n✅ User created successfully!');
    console.log('\nUser Details:');
    console.log('  UID:', userRecord.uid);
    console.log('  Email:', userRecord.email);
    console.log('  Email Verified:', userRecord.emailVerified);
    console.log('\n📝 You can now use these credentials to sign in:');
    console.log('  Email:', email);
    console.log('  Password:', '*'.repeat(password.length));
    console.log('\n');
    
  } catch (error) {
    console.error('\n❌ Error creating user:', error.message);
    
    if (error.code === 'auth/email-already-exists') {
      console.log('\n💡 This email is already registered. Try a different email or sign in with existing credentials.');
    } else if (error.code === 'auth/invalid-email') {
      console.log('\n💡 Invalid email format. Please enter a valid email address.');
    } else {
      console.log('\n💡 Error code:', error.code);
    }
  } finally {
    rl.close();
  }
}

// Run the script
createAdminUser();
