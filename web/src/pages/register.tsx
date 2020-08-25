import React from 'react'
import {Form, Formik} from 'formik';
import {Box, Button, FormControl, FormErrorMessage, FormLabel, Input} from "@chakra-ui/core/dist";
import {Wrapper} from "../components/Wrapper";
import {InputField} from "../components/InputField";

interface registerProps {

}

const Register: React.FC<registerProps> = ({}) => {
    return (
        <Wrapper variant={"small"}>
            <Formik
                initialValues={{username: "", password: ""}}
                onSubmit={(value) => {
                    console.log(value)
                }}
            >
                {({values, handleChange, isSubmitting}) => {
                    return (
                        <Form>
                            <InputField
                                label={"Username"}
                                placeholder={"Enter username"}
                                name={"username"}
                            />

                            <Box mt={6}>
                                <InputField
                                    label={"Password"}
                                    placeholder={"Enter password"}
                                    name={"password"}
                                    type={"password"}
                                />
                            </Box>

                            <Button
                                mt={6}
                                type={"submit"}
                                isLoading={isSubmitting}
                                variantColor={"teal"}
                            >
                                Register
                            </Button>
                        </Form>
                    )
                }}
            </Formik>
        </Wrapper>
    );
}

export default Register;
