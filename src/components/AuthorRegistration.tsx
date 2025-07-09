import React, { useState } from 'react';
import { User, Lock, Mail, FileText, ArrowLeft, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthorRegistrationProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

const AuthorRegistration: React.FC<AuthorRegistrationProps> = ({ onBack, onLoginSuccess }) => {
  const { login, register, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    avatar: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Сва поља су обавезна');
      return;
    }

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        onLoginSuccess();
      } else {
        setError('Неисправна е-адреса или лозинка');
      }
    } catch (err) {
      setError('Грешка при пријављивању. Покушајте поново.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Валидација
    if (!formData.name || !formData.email || !formData.password) {
      setError('Сва поља су обавезна');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Лозинке се не подударају');
      return;
    }

    if (formData.password.length < 6) {
      setError('Лозинка мора имати најмање 6 карактера');
      return;
    }

    try {
      const result = await register(
        formData.email,
        formData.password,
        formData.name,
        formData.bio || undefined,
        formData.avatar || undefined
      );

      if (result.success) {
        setSuccess('Успешно сте се регистровали! Проверите е-пошту за потврду налога.');
        
        // Очисти форму
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          bio: '',
          avatar: ''
        });
        
        // Пребаци на пријаву након 3 секунде
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
        }, 3000);
      } else {
        setError(result.error || 'Грешка при регистрацији. Покушајте поново.');
      }
    } catch (err) {
      setError('Грешка при регистрацији. Покушајте поново.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-amber-800 hover:text-amber-900 transition-colors mb-6 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Назад на блог</span>
          </button>
          
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Пријава аутора' : 'Регистрација аутора'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin 
              ? 'Приступите својој контролној табли' 
              : 'Придружите се заједници писаца заплањског краја'
            }
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex bg-amber-100 rounded-lg p-1">
          <button
            onClick={() => {
              setIsLogin(true);
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isLogin 
                ? 'bg-amber-800 text-amber-50 shadow-sm' 
                : 'text-amber-800 hover:bg-amber-200'
            }`}
          >
            Пријава
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !isLogin 
                ? 'bg-amber-800 text-amber-50 shadow-sm' 
                : 'text-amber-800 hover:bg-amber-200'
            }`}
          >
            Регистрација
          </button>
        </div>

        {/* Forms */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Е-адреса
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-amber-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    placeholder="Унесите е-адресу"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Лозинка
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-amber-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    placeholder="Унесите лозинку"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-amber-50 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-amber-800 hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500'
                } transition-colors`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Пријављујем...</span>
                  </div>
                ) : (
                  'Пријави се'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Пуно име
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-amber-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    placeholder="Унесите пуно име"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Е-адреса
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-amber-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    placeholder="Унесите е-адресу"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Лозинка
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-amber-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    placeholder="Унесите лозинку (мин. 6 карактера)"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Потврди лозинку
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-amber-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    placeholder="Поновите лозинку"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                  Слика профила (опционо)
                </label>
                <div className="space-y-3">
                  <input
                    id="avatar"
                    name="avatar"
                    type="url"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-amber-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    placeholder="Унесите URL слике профила..."
                  />
                  
                  {/* Avatar Preview */}
                  {formData.avatar && (
                    <div className="flex items-center space-x-4">
                      <img
                        src={formData.avatar}
                        alt="Преглед слике профила"
                        className="w-16 h-16 rounded-full object-cover border-2 border-amber-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div>
                        <p className="text-sm text-gray-600">Преглед слике профила</p>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, avatar: '' }))}
                          className="text-xs text-red-600 hover:text-red-800 transition-colors"
                        >
                          Уклони слику
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Placeholder when no avatar */}
                  {!formData.avatar && (
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Унесите URL слике изнад</p>
                        <p className="text-xs text-gray-500">Препоручене димензије: 150x150px</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Кратка биографија (опционо)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-amber-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    placeholder="Опишите себе у неколико реченица..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-amber-50 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-amber-800 hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500'
                } transition-colors`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Региструјем...</span>
                  </div>
                ) : (
                  'Региструј се'
                )}
              </button>
            </form>
          )}

          {/* Messages */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-300 rounded-md p-3">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mt-4 bg-green-50 border border-green-300 rounded-md p-3">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-sm text-green-700">{success}</span>
              </div>
            </div>
          )}

          {/* Demo Info for Login */}
          {isLogin && (
            <div className="mt-6 p-4 bg-amber-50 rounded-md">
              <h4 className="text-sm font-medium text-amber-900 mb-2">Напомена:</h4>
              <p className="text-xs text-amber-800">
                Сада користимо Supabase за аутентификацију. Потребно је да се региструјете или користите постојећи налог.
              </p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Зашто се придружити ауторима?
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-amber-800 font-bold">•</span>
              <span>Делите своје приче о заплањском крају</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-800 font-bold">•</span>
              <span>Чувајте традицију и културу за будуће генерације</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-800 font-bold">•</span>
              <span>Повежите се са другим писцима и читаоцима</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-800 font-bold">•</span>
              <span>Користите једноставне алате за писање и објављивање</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthorRegistration;