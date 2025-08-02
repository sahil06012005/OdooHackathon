import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SecuritySection = ({ onPasswordChange, isChangingPassword }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleInputChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData?.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData?.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData?.newPassword?.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(passwordData?.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!passwordData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (passwordData?.currentPassword === passwordData?.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = () => {
    if (validatePassword()) {
      onPasswordChange(passwordData);
      // Clear form after successful submission
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev?.[field]
    }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password?.length >= 8) strength++;
    if (/[a-z]/?.test(password)) strength++;
    if (/[A-Z]/?.test(password)) strength++;
    if (/\d/?.test(password)) strength++;
    if (/[^a-zA-Z\d]/?.test(password)) strength++;
    
    const strengthMap = {
      0: { label: 'Very Weak', color: 'bg-red-500' },
      1: { label: 'Weak', color: 'bg-red-400' },
      2: { label: 'Fair', color: 'bg-yellow-500' },
      3: { label: 'Good', color: 'bg-blue-500' },
      4: { label: 'Strong', color: 'bg-green-500' },
      5: { label: 'Very Strong', color: 'bg-green-600' }
    };
    
    return { strength, ...strengthMap?.[strength] };
  };

  const passwordStrength = getPasswordStrength(passwordData?.newPassword);

  return (
    <div className="bg-card rounded-xl shadow-elevation-2 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="Shield" size={20} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Security Settings</h2>
      </div>
      {/* Password Change Section */}
      <div className="space-y-6">
        <div className="relative">
          <Input
            label="Current Password"
            type={showPasswords?.current ? "text" : "password"}
            value={passwordData?.currentPassword}
            onChange={(e) => handleInputChange('currentPassword', e?.target?.value)}
            error={errors?.currentPassword}
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('current')}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={showPasswords?.current ? "EyeOff" : "Eye"} size={16} />
          </button>
        </div>

        <div className="relative">
          <Input
            label="New Password"
            type={showPasswords?.new ? "text" : "password"}
            value={passwordData?.newPassword}
            onChange={(e) => handleInputChange('newPassword', e?.target?.value)}
            error={errors?.newPassword}
            description="Must be at least 8 characters with uppercase, lowercase, and number"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('new')}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={showPasswords?.new ? "EyeOff" : "Eye"} size={16} />
          </button>
          
          {/* Password Strength Indicator */}
          {passwordData?.newPassword && (
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength?.color}`}
                    style={{ width: `${(passwordStrength?.strength / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {passwordStrength?.label}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <Input
            label="Confirm New Password"
            type={showPasswords?.confirm ? "text" : "password"}
            value={passwordData?.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
            error={errors?.confirmPassword}
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirm')}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={showPasswords?.confirm ? "EyeOff" : "Eye"} size={16} />
          </button>
        </div>

        <div className="flex justify-end">
          <Button
            variant="default"
            iconName="Key"
            iconPosition="left"
            onClick={handleSubmit}
            loading={isChangingPassword}
            disabled={!passwordData?.currentPassword || !passwordData?.newPassword || !passwordData?.confirmPassword}
          >
            Change Password
          </Button>
        </div>
      </div>
      {/* Security Info */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Password Security Tips:</p>
            <ul className="space-y-1 text-xs">
              <li>• Use a unique password for your QuickDesk account</li>
              <li>• Include a mix of letters, numbers, and special characters</li>
              <li>• Avoid using personal information or common words</li>
              <li>• Consider using a password manager for better security</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;