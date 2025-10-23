import { toast } from 'react-toastify';

export const showSuccess = (message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 2000,
    theme: 'colored',
  });
};

export const showError = (message) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 3000,
    theme: 'colored',
  });
};

export const showInfo = (message) => {
  toast.info(message, {
    position: 'top-right',
    autoClose: 2500,
    theme: 'colored',
  });
};

export const showWarning = (message) => {
  toast.warning(message, {
    position: 'top-right',
    autoClose: 2500,
    theme: 'colored',
  });
}
