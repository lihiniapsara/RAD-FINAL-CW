import { Eye, EyeOff, Mail, Lock, User, Shield, CheckCircle, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';
import React, {useEffect, useState} from "react";
import Footer from "./Footer.tsx";
import { useNavigate } from "react-router-dom";

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Validation states
  const [validation, setValidation] = useState({
    email: { isValid: false, message: '' },
    password: { isValid: false, message: '' },
    confirmPassword: { isValid: false, message: '' },
    name: { isValid: false, message: '' }
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    return {
      isValid,
      message: isValid ? '' : 'Please enter a valid email address'
    };
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    const isValid = hasUpperCase && hasLowerCase && hasNumbers && hasSpecial && isLongEnough;

    if (!password) return { isValid: false, message: '' };
    if (!isLongEnough) return { isValid: false, message: 'Password must be at least 8 characters' };
    if (!hasUpperCase) return { isValid: false, message: 'Password must contain uppercase letter' };
    if (!hasLowerCase) return { isValid: false, message: 'Password must contain lowercase letter' };
    if (!hasNumbers) return { isValid: false, message: 'Password must contain a number' };
    if (!hasSpecial) return { isValid: false, message: 'Password must contain special character' };

    return { isValid: true, message: 'Strong password!' };
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return { isValid: false, message: '' };
    const isValid = password === confirmPassword;
    return {
      isValid,
      message: isValid ? 'Passwords match!' : 'Passwords do not match'
    };
  };

  const validateName = (name) => {
    const isValid = name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
    return {
      isValid,
      message: isValid ? '' : 'Please enter a valid name (letters only, min 2 chars)'
    };
  };

  // Handle input changes with validation
  const handleLoginChange = (field, value) => {
    setLoginData(prev => ({ ...prev, [field]: value }));

    if (field === 'email') {
      setValidation(prev => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handleSignupChange = (field, value) => {
    setSignupData(prev => ({ ...prev, [field]: value }));

    switch (field) {
      case 'email':
        setValidation(prev => ({ ...prev, email: validateEmail(value) }));
        break;
      case 'password':
        setValidation(prev => ({
          ...prev,
          password: validatePassword(value),
          confirmPassword: validateConfirmPassword(value, signupData.confirmPassword)
        }));
        break;
      case 'confirmPassword':
        setValidation(prev => ({
          ...prev,
          confirmPassword: validateConfirmPassword(signupData.password, value)
        }));
        break;
      case 'name':
        setValidation(prev => ({ ...prev, name: validateName(value) }));
        break;
    }
  };

  // Get signup data for API call
  const getSignupDataForAPI = () => {
    return {
      name: signupData.name,
      email: signupData.email,
      password: signupData.password
    };
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (isLogin) {
        setLoginError('');
        const loginPayload = {
          email: loginData.email,
          password: loginData.password
        };
        try {
          const response = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginPayload)
          });
          if (response.ok) {
            // Optionally store token here
            navigate('/home'); // Navigate to home page
          } else {
            const data = await response.json();
            setLoginError(data.message || 'Invalid email or password');
          }
        } catch (error) {
          setLoginError('Network error. Please try again.');
        }
        setLoading(false);
        return;
      } else {
        // Signup API call
        const signupPayload = getSignupDataForAPI();
        try {
          const response = await fetch('http://localhost:3001/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupPayload)
          });
          if (response.ok) {
            setVerificationSent(true);
            setTimeout(() => setVerificationSent(false), 5000);
            // Optionally, you can auto-switch to login mode here
            // setIsLogin(true);
          } else {
            const data = await response.json();
            // Show error to user (add a signupError state if you want)
            alert(data.message || 'Signup failed');
          }
        } catch (error) {
          alert('Network error. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error('Authentication error:', error);
    }

    setLoading(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setVerificationSent(false);
    setLoginData({ email: '', password: '' });
    setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
    setValidation({
      email: { isValid: false, message: '' },
      password: { isValid: false, message: '' },
      confirmPassword: { isValid: false, message: '' },
      name: { isValid: false, message: '' }
    });
  };

  const InputField = ({
                        icon: Icon,
                        type,
                        placeholder,
                        value,
                        onChange,
                        validation,
                        showToggle = false,
                        showValue = false,
                        onToggle
                      }) => (
      <div className="relative mb-6">
        <div className="relative">
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
              type={showToggle ? (showValue ? 'text' : 'password') : type}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-lg border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  validation?.message && value
                      ? validation.isValid
                          ? 'border-green-500/50 focus:ring-green-500/50 bg-green-500/5'
                          : 'border-red-500/50 focus:ring-red-500/50 bg-red-500/5'
                      : 'border-white/20 focus:ring-purple-500/50 hover:border-white/30'
              }`}
          />
          {showToggle && (
              <button
                  type="button"
                  onClick={onToggle}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showValue ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
          )}
          {validation?.message && value && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {validation.isValid ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
          )}
        </div>
        {validation?.message && value && (
            <p className={`mt-2 text-sm flex items-center gap-2 ${
                validation.isValid ? 'text-green-400' : 'text-red-400'
            }`}>
              {validation.isValid ? (
                  <CheckCircle className="h-4 w-4" />
              ) : (
                  <AlertCircle className="h-4 w-4" />
              )}
              {validation.message}
            </p>
        )}
      </div>
  );

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 left-1/2 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-8 flex items-center justify-center min-h-screen">
          <div className={`w-full max-w-md transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    LibraryHub
                  </h1>
                  <p className="text-gray-300 mt-1">Your Digital Library Management</p>
                </div>
              </div>
            </div>

            {/* Auth Form */}
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 shadow-2xl">

              {/* Toggle Buttons */}
              <div className="flex bg-white/5 rounded-2xl p-1 mb-8">
                <button
                    onClick={() => isLogin || switchMode()}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        isLogin
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                  Login
                </button>
                <button
                    onClick={() => !isLogin || switchMode()}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        !isLogin
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Verification Success Message */}
              {verificationSent && (
                  <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-full">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-green-300 font-semibold">Verification Email Sent!</p>
                      <p className="text-green-400 text-sm">Please check your inbox to verify your account.</p>
                    </div>
                  </div>
              )}

              {/* Login Error Message */}
              {isLogin && loginError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-300 text-center">
                  {loginError}
                </div>
              )}

              <div className="space-y-6">
                {!isLogin && (
                    <InputField
                        icon={User}
                        type="text"
                        placeholder="Full Name"
                        value={signupData.name}
                        onChange={(value) => handleSignupChange('name', value)}
                        validation={validation.name}
                    />
                )}

                <InputField
                    icon={Mail}
                    type="email"
                    placeholder="Email Address"
                    value={isLogin ? loginData.email : signupData.email}
                    onChange={(value) => isLogin ? handleLoginChange('email', value) : handleSignupChange('email', value)}
                    validation={validation.email}
                />

                <InputField
                    icon={Lock}
                    type="password"
                    placeholder="Password"
                    value={isLogin ? loginData.password : signupData.password}
                    onChange={(value) => isLogin ? handleLoginChange('password', value) : handleSignupChange('password', value)}
                    validation={!isLogin ? validation.password : undefined}
                    showToggle={true}
                    showValue={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                />

                {!isLogin && (
                    <InputField
                        icon={Lock}
                        type="password"
                        placeholder="Confirm Password"
                        value={signupData.confirmPassword}
                        onChange={(value) => handleSignupChange('confirmPassword', value)}
                        validation={validation.confirmPassword}
                        showToggle={true}
                        showValue={showConfirmPassword}
                        onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                )}

                {/* Password Strength Indicator for Signup */}
                {!isLogin && signupData.password && (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Password Strength</span>
                        <span className={validation.password.isValid ? 'text-green-400' : 'text-orange-400'}>
                      {validation.password.isValid ? 'Strong' : 'Weak'}
                    </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                                validation.password.isValid
                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 w-full'
                                    : 'bg-gradient-to-r from-red-400 to-orange-500 w-1/3'
                            }`}
                        ></div>
                      </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold rounded-2xl hover:from-purple-600 hover:via-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-500 transform hover:scale-105 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                      </>
                  ) : (
                      <>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="h-5 w-5" />
                      </>
                  )}
                </button>
              </div>

              {/* Additional Options */}
              <div className="mt-8 text-center">
                {isLogin && (
                    <a href="#" className="text-purple-400 hover:text-purple-300 text-sm transition-colors duration-300">
                      Forgot your password?
                    </a>
                )}

                <div className="mt-4 text-gray-400 text-sm">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                      onClick={switchMode}
                      className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300"
                  >
                    {isLogin ? 'Sign up here' : 'Sign in here'}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            {/*<div className="text-center mt-8 text-gray-400 text-sm">
              <p>© 2024 LibraryHub. Secure & Modern Library Management</p>
            </div>*/}

            {<Footer />}
          </div>
        </div>
      </div>
  );
};

export default AuthForms;