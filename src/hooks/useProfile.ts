import { useMutation } from '@tanstack/react-query';
// Profile management hooks for user account operations
import { updatePassword, updateProfile as updateFirebaseProfile, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../services/firebase';
import { useAuthStore } from '../store/authStore';
import type { Address } from '../types';
import { message } from 'antd';

interface UpdateProfileData {
  displayName?: string;
  phoneNumber?: string;
  address?: Address;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Update user profile
export const useUpdateProfile = () => {
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      if (!user || !auth.currentUser) {
        throw new Error('User not authenticated');
      }

      // Update Firebase Auth profile if displayName changed
      if (data.displayName && data.displayName !== user.displayName) {
        await updateFirebaseProfile(auth.currentUser, {
          displayName: data.displayName,
        });
      }

      // Update Firestore user document
      const userRef = doc(db, 'users', user.id);
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (data.displayName !== undefined) {
        updateData.displayName = data.displayName;
      }
      if (data.phoneNumber !== undefined) {
        updateData.phoneNumber = data.phoneNumber;
      }
      if (data.address !== undefined) {
        updateData.address = data.address;
      }

      await updateDoc(userRef, updateData);

      // Update local user state
      const updatedUser = {
        ...user,
        ...data,
        updatedAt: new Date(),
      };
      
      setUser(updatedUser);
      return updatedUser;
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      message.error('Cập nhật thông tin thất bại!');
    },
  });
};

// Change password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      if (!auth.currentUser || !auth.currentUser.email) {
        throw new Error('User not authenticated');
      }

      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        data.currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      await updatePassword(auth.currentUser, data.newPassword);
    },
    onError: (error: any) => {
      console.error('Error changing password:', error);
      if (error.code === 'auth/wrong-password') {
        message.error('Mật khẩu hiện tại không đúng!');
      } else if (error.code === 'auth/weak-password') {
        message.error('Mật khẩu mới quá yếu!');
      } else {
        message.error('Đổi mật khẩu thất bại!');
      }
      throw error;
    },
  });
};

// Upload avatar
export const useUploadAvatar = () => {
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user || !auth.currentUser) {
        throw new Error('User not authenticated');
      }

      // Create a unique filename
      const fileName = `avatars/${user.id}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, fileName);

      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update Firebase Auth profile
      await updateFirebaseProfile(auth.currentUser, {
        photoURL: downloadURL,
      });

      // Update Firestore user document
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        photoURL: downloadURL,
        updatedAt: new Date(),
      });

      // Update local user state
      const updatedUser = {
        ...user,
        photoURL: downloadURL,
        updatedAt: new Date(),
      };
      
      setUser(updatedUser);
      return downloadURL;
    },
    onError: (error) => {
      console.error('Error uploading avatar:', error);
      message.error('Tải ảnh đại diện thất bại!');
    },
  });
};