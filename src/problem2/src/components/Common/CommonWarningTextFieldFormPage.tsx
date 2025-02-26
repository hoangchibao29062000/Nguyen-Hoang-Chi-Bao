import { TextField, FormLabel } from '@mui/material';

export interface CommonWarningTextFieldFormPageProps {
  formik: any;
  valueName: string;
  lable: string;
  handleChange: any;
  handleBlur: any;
}

export function CommonWarningTextFieldFormPage({ formik, valueName, lable}: CommonWarningTextFieldFormPageProps) {
  return (
    <>
      <FormLabel>{lable}</FormLabel>
      <TextField
        fullWidth
        label={lable}
        id={valueName}
        name={valueName}
        value={formik.values[valueName]}  // Lấy giá trị từ Formik
        // onChange={handleChange}  // Cập nhật giá trị khi người dùng nhập
        // onBlur={handleBlur}
        error={formik.touched[valueName] && Boolean(formik.errors[valueName])}
        helperText={formik.touched[valueName] && formik.errors[valueName] ? formik.errors[valueName] : ''}
        sx={{ marginBottom: 2 }}
      />
    </>
  );
}

