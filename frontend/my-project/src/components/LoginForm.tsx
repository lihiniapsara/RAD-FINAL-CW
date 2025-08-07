import { Eye, EyeOff, Mail, Lock, User, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../store/slice/AuthSlice';
import type { LoginData, SignupData, User as AppUser } from '@/types/user';
import {login, signup} from "@/service/userService.ts";
import Footer from "@/components/Footer.tsx";
interface ValidationState {
  email: { isValid: boolean; message: string };
  password: { isValid: boolean; message: string };
  confirmPassword: { isValid: boolean; message: string };
  name: { isValid: boolean; message: string };
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>(''); // New success state

  const [loginData, setLoginData] = useState<LoginData>(() => ({ email: '', password: '' }));
  const [signupData, setSignupData] = useState<SignupData>(() => ({ name: '', email: '', password: '', confirmPassword: '' }));
  const [validation, setValidation] = useState<ValidationState>({
    email: { isValid: false, message: '' },
    password: { isValid: false, message: '' },
    confirmPassword: { isValid: false, message: '' },
    name: { isValid: false, message: '' },
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    return { isValid, message: isValid ? '' : 'Please enter a valid email address' };
  };

  const validatePassword = (password: string) => {
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

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return { isValid: false, message: '' };
    const isValid = password === confirmPassword;
    return { isValid, message: isValid ? 'Passwords match!' : 'Passwords do not match' };
  };

  const validateName = (name: string) => {
    const isValid = name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
    return { isValid, message: isValid ? '' : 'Please enter a valid name (letters only, min 2 chars)' };
  };

  const handleLoginChange = (field: keyof LoginData, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
    if (field === 'email') {
      setValidation((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handleSignupChange = (field: keyof SignupData, value: string) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
    switch (field) {
      case 'email':
        setValidation((prev) => ({ ...prev, email: validateEmail(value) }));
        break;
      case 'password':
        setValidation((prev) => ({
          ...prev,
          password: validatePassword(value),
          confirmPassword: validateConfirmPassword(value, signupData.confirmPassword),
        }));
        break;
      case 'confirmPassword':
        setValidation((prev) => ({
          ...prev,
          confirmPassword: validateConfirmPassword(signupData.password, value),
        }));
        break;
      case 'name':
        setValidation((prev) => ({ ...prev, name: validateName(value) }));
        break;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const { email, password } = loginData;
        if (!validation.email.isValid || !email || !password) {
          setError('Please fill in all fields correctly');
          setLoading(false);
          return;
        }
        const response = await login(email, password);
        const user: AppUser = { _id: response.user._id, name: response.user.name, email: response.user.email } as AppUser;        dispatch(loginAction({ user, accessToken: response.accessToken }));
        navigate('/home');
      } else {
        const { name, email, password, confirmPassword } = signupData;
        if (
            !validation.name.isValid ||
            !validation.email.isValid ||
            !validation.password.isValid ||
            !validation.confirmPassword.isValid ||
            !name ||
            !email ||
            !password ||
            !confirmPassword
        ) {
          setError('Please fill in all fields correctly');
          setLoading(false);
          return;
        }
        await signup(name, email, password);
        setSuccess('Verification email sent! Please check your inbox.');
        setTimeout(() => setSuccess(''), 5000); // Clear success message after 5s
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setLoginData({ email: '', password: '' });
    setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
    setValidation({
      email: { isValid: false, message: '' },
      password: { isValid: false, message: '' },
      confirmPassword: { isValid: false, message: '' },
      name: { isValid: false, message: '' },
    });
  };

  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-7">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">LibraryHub</h1>
            </div>
            <p className="text-gray-600">Your Digital Library Management</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                  onClick={() => isLogin || switchMode()}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                      isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Login
              </button>
              <button
                  onClick={() => !isLogin || switchMode()}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                      !isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Sign Up
              </button>
            </div>
            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-center">
                  {success}
                </div>
            )}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-center">
                  {error}
                </div>
            )}
            <div className="space-y-4">
              {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                          type="text"
                          placeholder="Enter your full name"
                          value={signupData.name}
                          onChange={(e) => handleSignupChange('name', e.target.value)}
                          className={`w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                              validation.name.message && signupData.name
                                  ? validation.name.isValid
                                      ? 'border-green-500 bg-green-50'
                                      : 'border-red-500 bg-red-50'
                                  : 'border-gray-300'
                          }`}
                      />
                      {validation.name.message && signupData.name && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {validation.name.isValid ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                      )}
                    </div>
                    {validation.name.message && signupData.name && (
                        <p className={`mt-1 text-sm ${validation.name.isValid ? 'text-green-600' : 'text-red-600'}`}>
                          {validation.name.message}
                        </p>
                    )}
                  </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                      type="email"
                      placeholder="Enter your email"
                      value={isLogin ? loginData.email : signupData.email}
                      onChange={(e) => (isLogin ? handleLoginChange('email', e.target.value) : handleSignupChange('email', e.target.value))}
                      className={`w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          validation.email.message && (isLogin ? loginData.email : signupData.email)
                              ? validation.email.isValid
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-red-500 bg-red-50'
                              : 'border-gray-300'
                      }`}
                  />
                  {validation.email.message && (isLogin ? loginData.email : signupData.email) && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {validation.email.isValid ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                  )}
                </div>
                {validation.email.message && (isLogin ? loginData.email : signupData.email) && (
                    <p className={`mt-1 text-sm ${validation.email.isValid ? 'text-green-600' : 'text-red-600'}`}>
                      {validation.email.message}
                    </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={isLogin ? loginData.password : signupData.password}
                      onChange={(e) => (isLogin ? handleLoginChange('password', e.target.value) : handleSignupChange('password', e.target.value))}
                      className={`w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          !isLogin && validation.password.message && signupData.password
                              ? validation.password.isValid
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-red-500 bg-red-50'
                              : 'border-gray-300'
                      }`}
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {!isLogin && validation.password.message && signupData.password && (
                    <p className={`mt-1 text-sm ${validation.password.isValid ? 'text-green-600' : 'text-red-600'}`}>
                      {validation.password.message}
                    </p>
                )}
              </div>
              {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={signupData.confirmPassword}
                          onChange={(e) => handleSignupChange('confirmPassword', e.target.value)}
                          className={`w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                              validation.confirmPassword.message && signupData.confirmPassword
                                  ? validation.confirmPassword.isValid
                                      ? 'border-green-500 bg-green-50'
                                      : 'border-red-500 bg-red-50'
                                  : 'border-gray-300'
                          }`}
                      />
                      <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {validation.confirmPassword.message && signupData.confirmPassword && (
                        <p className={`mt-1 text-sm ${validation.confirmPassword.isValid ? 'text-green-600' : 'text-red-600'}`}>
                          {validation.confirmPassword.message}
                        </p>
                    )}
                  </div>
              )}
              {!isLogin && signupData.password && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Password Strength</span>
                      <span className={validation.password.isValid ? 'text-green-600' : 'text-orange-600'}>
                    {validation.password.isValid ? 'Strong' : 'Weak'}
                  </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                              validation.password.isValid ? 'bg-green-500 w-full' : 'bg-orange-500 w-1/3'
                          }`}
                      ></div>
                    </div>
                  </div>
              )}
              <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </div>
                ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </div>
            <div className="mt-6 text-center">
              {isLogin && (
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot your password?
                  </a>
              )}
              <div className="mt-4 text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={switchMode} className="text-blue-600 hover:text-blue-800 font-medium">
                  {isLogin ? 'Sign up here' : 'Sign in here'}
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
  );
};

export default LoginForm;
