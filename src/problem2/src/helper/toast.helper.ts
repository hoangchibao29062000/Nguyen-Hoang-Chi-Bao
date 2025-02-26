import { toast } from 'react-toastify';

export const toastNoti = (message: string, status: number) => {
  if (message !== null && message !== undefined && message !== '') {
    if (status >= 200 && status < 400) toast.success(message);
    else toast.error(message);
  }
};
