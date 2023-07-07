import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { FormType, GroupAccess, User } from "../types";
import { datetimeLocal } from "../util";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

type FormUserProp = {
  user: User | undefined;
  type: FormType;
  handleCancel: () => void;
  handleForm: (user: User) => void;
};

export default function FormUser({
  user,
  type,
  handleCancel,
  handleForm,
}: FormUserProp) {
  const {
    firstname = "",
    lastname = "",
    username = "",
    email = "",
    password = "",
    confirmPassword = "",
    expiredDate = new Date(),
    groupAccess = GroupAccess.ADMIN,
  } = type === FormType.UPDATE ? user || {} : {};

  const submitForm = async (
    values: User,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const data: User = {
      ...values,
      expiredDate: new Date(values.expiredDate),
    };
    handleForm(data);
    setTimeout(() => setSubmitting(false), 2000);
  };

  const formik = useFormik({
    enableReinitialize: type === FormType.UPDATE,
    initialValues: {
      firstname,
      lastname,
      username,
      email,
      password,
      confirmPassword,
      expiredDate,
      groupAccess,
    },
    onSubmit: (values, { setSubmitting }) => submitForm(values, setSubmitting),
    validationSchema: Yup.object().shape({
      firstname: Yup.string()
        .min(2, "minimal 2 characters")
        .max(50, "maximal 50 characters")
        .required("First Name is required"),

      lastname: Yup.string()
        .min(2, "minimal 2 characters")
        .max(50, "maximal 50 characters")
        .required("Last Name is required"),

      username: Yup.string()
        .required("Username is required")
        .matches(
          /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
          "Username not valid"
        ),

      email: Yup.string().email().required("Email is required"),

      password: Yup.string()
        .required("Password is required")
        .min(6, "Password is too short - should be 6 chars minimum")
        .matches(
          /^(?=.*?[A-Z])(?=.*?[#?!@$%^&*-]).{6,}$/,
          "Password must contains 1 Uppercase and 1 Special Character"
        ),

      confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),

      expiredDate: Yup.string().required("Expired Date is required"),
    }),
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid,
  } = formik;

  return (
    <Card className="mx-auto w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            {type === FormType.CREATE
              ? "Create User"
              : `Update User ${firstname} ${lastname}`}
          </Typography>
        </CardHeader>
        <CardBody className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="text"
              label="First Name"
              id="firstname"
              name="firstname"
              variant="outlined"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.firstname}
              required={true}
              error={typeof errors.firstname === "string" && touched.firstname}
              success={errors.firstname === undefined && touched.firstname}
            />
            {errors.firstname && touched.firstname && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal mt-2"
              >
                <InformationCircleIcon className="w-4 h-4 -mt-px" />
                {errors.firstname}
              </Typography>
            )}
          </div>
          <div>
            <Input
              type="text"
              label="Last Name"
              id="lastname"
              name="lastname"
              variant="outlined"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.lastname}
              required={true}
              error={typeof errors.lastname === "string" && touched.lastname}
              success={errors.lastname === undefined && touched.lastname}
            />
            {errors.lastname && touched.lastname && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal mt-2"
              >
                <InformationCircleIcon className="w-4 h-4 -mt-px" />
                {errors.lastname}
              </Typography>
            )}
          </div>
          <div>
            <Input
              type="text"
              label="Username"
              id="username"
              name="username"
              variant="outlined"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
              required={true}
              error={typeof errors.username === "string" && touched.username}
              success={errors.username === undefined && touched.username}
            />
            {errors.username && touched.username && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal mt-2"
              >
                <InformationCircleIcon className="w-4 h-4 -mt-px" />
                {errors.username}
              </Typography>
            )}
          </div>
          <div>
            <Input
              type="email"
              label="Email"
              id="email"
              name="email"
              variant="outlined"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              required={true}
              error={typeof errors.email === "string" && touched.email}
              success={errors.email === undefined && touched.email}
            />
            {errors.email && touched.email && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal mt-2"
              >
                <InformationCircleIcon className="w-4 h-4 -mt-px" />
                {errors.email}
              </Typography>
            )}
          </div>
          <div>
            <Input
              type="password"
              label="Password"
              id="password"
              name="password"
              variant="outlined"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              required={true}
              error={typeof errors.password === "string" && touched.password}
              success={errors.password === undefined && touched.password}
            />
            {errors.password && touched.password && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal mt-2"
              >
                <InformationCircleIcon className="w-4 h-4 -mt-px" />
                {errors.password}
              </Typography>
            )}
          </div>
          <div>
            <Input
              type="password"
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              variant="outlined"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.confirmPassword}
              required={true}
              error={
                typeof errors.confirmPassword === "string" &&
                touched.confirmPassword
              }
              success={
                errors.confirmPassword === undefined && touched.confirmPassword
              }
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal mt-2"
              >
                <InformationCircleIcon className="w-4 h-4 -mt-px" />
                {errors.confirmPassword}
              </Typography>
            )}
          </div>
          <div>
            <Input
              type="datetime-local"
              label="Expired Date"
              id="expiredDate"
              name="expiredDate"
              variant="outlined"
              onChange={handleChange}
              onBlur={handleBlur}
              value={datetimeLocal(values.expiredDate)}
              required={true}
              min={datetimeLocal(new Date())}
              error={errors.expiredDate && Boolean(touched.expiredDate)}
              success={!errors.expiredDate && Boolean(touched.expiredDate)}
            />
            {errors.expiredDate && touched.expiredDate && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal mt-2"
              >
                <InformationCircleIcon className="w-4 h-4 -mt-px" />
                {errors.expiredDate}
              </Typography>
            )}
          </div>
          <div>
            <Select
              label="Group Access"
              id="groupAccess"
              name="groupAccess"
              variant="outlined"
              onChange={(e) => setFieldValue("groupAccess", e)}
              onBlur={handleBlur}
              value={values.groupAccess}
              error={
                typeof errors.groupAccess === "string" && touched.groupAccess
              }
              success={errors.groupAccess === undefined && touched.groupAccess}
            >
              <Option value={GroupAccess.ADMIN}>Admin</Option>
              <Option value={GroupAccess.MEMBER}>Member</Option>
            </Select>
            {errors.groupAccess && touched.groupAccess && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal mt-2"
              >
                <InformationCircleIcon className="w-4 h-4 -mt-px" />
                {errors.groupAccess}
              </Typography>
            )}
          </div>
        </CardBody>
        <CardFooter className="flex justify-between gap-4">
          <Button
            variant="outlined"
            color="red"
            onClick={handleCancel}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            type="submit"
            disabled={!isValid || isSubmitting}
            fullWidth
          >
            Submit
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
