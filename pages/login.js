import {
    ChakraProvider,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Box,
    Button,
    Heading,
    Input,
    SimpleGrid
} from "@chakra-ui/react";
import { withIronSessionSsr } from "iron-session/next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import config from "../utils/config";
import theme from "../utils/extendChakra";
import adminScreenshot from "../public/assets/admin-screenshot.webp";

export default function Login() {
    const router = useRouter();
    const [alert, setAlert] = useState(null);

    const login = e => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        fetch("/api/login", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(json => {
                if (json.success) router.push("/admin");
                else
                    setAlert({
                        title: "Oops, there was a problem",
                        description: json.reason
                    });
            })
            .catch(err =>
                setAlert({
                    title: "Oops, there was a problem",
                    description: err.message
                })
            );
    };

    return (
        <ChakraProvider theme={theme}>
            <SimpleGrid
                columns={{ base: 1, xl: 2 }}
                height={{ xl: "100vh" }}
                overflow="hidden">
                <Box
                    backgroundColor="blue.500"
                    display="flex"
                    alignItems="center"
                    position="relative"
                    pt={3}
                    pr={3}
                    pb={3}>
                    <Image
                        alt="Admin page screenshot"
                        src={adminScreenshot}
                        style={{
                            borderTopRightRadius: "15px",
                            borderBottomRightRadius: "15px"
                        }}
                    />
                </Box>
                <Box
                    display="flex"
                    alignItems="center"
                    flexDirection="column"
                    justifyContent="center"
                    p={14}>
                    <Heading textAlign={{ base: "center", md: "initial" }}>
                        Yes, you have to log in.
                    </Heading>
                    {alert && (
                        <Alert
                            flexDir={{ base: "column", md: "row" }}
                            mt={7}
                            status="error"
                            textAlign={{ base: "center", md: "initial" }}>
                            <AlertIcon />
                            <AlertTitle>{alert.title}</AlertTitle>
                            <AlertDescription>
                                {alert.description}
                            </AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={login}>
                        <Input
                            autoComplete="off"
                            mt={alert ? 3 : 7}
                            name="username"
                            placeholder="Username"
                            required
                            size="lg"
                        />
                        <Input
                            mt={3}
                            name="password"
                            placeholder="Password"
                            required
                            type="password"
                            size="lg"
                        />
                        <Button
                            colorScheme="blue"
                            my={3}
                            type="submit"
                            width="100%">
                            Log in
                        </Button>
                    </form>
                </Box>
            </SimpleGrid>
        </ChakraProvider>
    );
}

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
        const admin = req.session.admin;
        if (!admin || !admin.signedin) return { props: {} };
        return { redirect: { permanent: false, destination: "/admin" } };
    },
    {
        cookieName: config.AUTH_TOKEN,
        password: config.AUTH_PASSWORD,
        cookieOptions: {
            secure: config.NODE_ENV === "production"
        }
    }
);
