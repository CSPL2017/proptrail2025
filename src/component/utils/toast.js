import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const showToast = (type = 'info', message) => {
  switch (type) {
    case 'success':
      toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
      });
      break;
    case 'error':
      toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
      });
      break;
    case 'warning':
      toast.warning(message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
      });
      break;
    default:
      toast.info(message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
      });
      break;
  }
};
