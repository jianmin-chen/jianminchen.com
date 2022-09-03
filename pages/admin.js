import {
    ChakraProvider,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    Input,
    SimpleGrid,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel
} from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import dayjs from "dayjs";
import { withIronSessionSsr } from "iron-session/next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AdminMenu from "../components/admin/menu";
import config from "../utils/config";
import showdownConverter from "../utils/showdown";
import theme from "../utils/extendChakra";
import "highlight.js/styles/base16/ashes.css";
import signature from "../public/assets/signature.png";

export default function Newsletter() {
    const [alert, setAlert] = useState({
        status: "info",
        title: "Newsletter style",
        description:
            "The newsletter styles used here might not be present in the actual email"
    });

    const [newsletterSubject, setNewsletterSubject] = useState(
        "Newsletter from jianminchen.com"
    );
    const [newsletterMarkdown, setNewsletterMarkdown] = useState("");
    const [newsletterHtml, setNewsletterHtml] = useState("");
    useEffect(
        () => setNewsletterHtml(showdownConverter.makeHtml(newsletterMarkdown)),
        [newsletterMarkdown]
    );
    const sendNewsletter = e => {
        e.preventDefault();
        if (!newsletterSubject) {
            setAlert({
                status: "error",
                title: "Problem sending newsletter",
                description:
                    "Huh. Looks like you forgot to include a subject line. Try again?"
            });
        } else if (!newsletterHtml) {
            setAlert({
                status: "error",
                title: "Problem sending newsletter",
                description:
                    "Huh. Looks like you forgot to include the content for the newsletter. Try again?"
            });
        }

        fetch("/api/auth/newsletter", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                html: newsletterHtml,
                subject: newsletterSubject
            })
        })
            .then(res => res.json())
            .then(json => {
                if (!json.success) {
                    setAlert({
                        status: "error",
                        title: "Problem sending newsletter",
                        description: `A problem occurred while sending the newsletter: ${json.reason}`
                    });
                } else {
                    setAlert({
                        status: "success",
                        title: "Newsletter sent",
                        description: "Great! The newsletter has been sent."
                    });
                    updatePastNewsletters();
                }
            })
            .catch(err =>
                setAlert({
                    status: "error",
                    title: "Problem sending newsletter",
                    description: `A problem occurred while sending the newsletter: ${err}`
                })
            );
    };

    const [pastNewsletters, setPastNewsletters] = useState([]);
    const [currentNewsletter, setCurrentNewsletter] = useState(0); // Set to latest in sorted newsletters
    const updatePastNewsletters = () => {
        fetch("/api/auth/newsletter")
            .then(res => res.json())
            .then(json => {
                if (!json.success)
                    setAlert({
                        status: "error",
                        title: "Problem retrieving past newsletters",
                        description: `A problem occurred while retrieving past newsletters: ${err}`
                    });
                else setPastNewsletters(json.newsletters);
            })
            .catch(err =>
                setAlert({
                    status: "error",
                    title: "Problem retrieving past newsletters",
                    description: `A problem occurred while retrieving past newsletters: ${err}`
                })
            );
    };
    useEffect(() => {
        updatePastNewsletters();
    }, [currentNewsletter]);

    const [subscribers, setSubscribers] = useState([]);
    const deleteSubscriber = email => {
        fetch("/api/auth/subscribers", {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        })
            .then(res => res.json())
            .then(json => {
                if (!json.success) {
                    setAlert({
                        status: "error",
                        title: "Problem deleting subscriber",
                        description: `A problem occurred while deleting ${email} from the list of subscribers: ${json.reason}`
                    });
                } else {
                    updateSubscribers();
                    setAlert({
                        status: "success",
                        title: "Subscriber deleted",
                        description: `${email} has been successfully deleted.`
                    });
                }
            })
            .catch(err =>
                setAlert({
                    status: "error",
                    title: "Problem deleting subscriber",
                    description: `A problem occurred while deleting ${email} from the list of subscribers: ${err}`
                })
            );
    };
    const updateSubscribers = () => {
        fetch("/api/auth/subscribers")
            .then(res => res.json())
            .then(json => {
                if (!json.success) {
                    setAlert({
                        status: "error",
                        title: "Problem sending newsletter",
                        description: `A problem occurred while getting the subscribers: ${json.reason}`
                    });
                } else {
                    setSubscribers(json.subscribers);
                }
            })
            .catch(err =>
                setAlert({
                    status: "error",
                    title: "Problem sending newsletter",
                    description: `A problem occurred while getting the subscribers: ${err}`
                })
            );
    };
    useEffect(updateSubscribers, []);

    return (
        <ChakraProvider theme={theme}>
            <Box p={{ base: 7, lg: 14 }}>
                <AdminMenu refresh={updateSubscribers} />
                <Heading mb={4}>Newsletter actions</Heading>
                {alert && (
                    <Alert
                        mb={4}
                        flexDir={{ base: "column", md: "row" }}
                        status={alert.status}
                        textAlign={{ base: "center", md: "initial" }}>
                        <AlertIcon />
                        <AlertTitle>{alert.title}</AlertTitle>
                        <AlertDescription>{alert.description}</AlertDescription>
                    </Alert>
                )}
                <Tabs isFitted>
                    <TabList overflowX="auto" overflowY="hidden">
                        <Tab>Newsletter</Tab>
                        <Tab>Subscribers</Tab>
                        <Tab whiteSpace="nowrap">Past newsletters</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <form onSubmit={sendNewsletter}>
                                <Flex
                                    flexDir={{ base: "column", md: "row" }}
                                    gap={{ base: 2, md: 4 }}
                                    mb={4}
                                    py={{ base: 2, lg: 0 }}>
                                    <Input
                                        onChange={e =>
                                            setNewsletterSubject(e.target.value)
                                        }
                                        placeholder="Subject"
                                        isRequired
                                        value={newsletterSubject}
                                    />
                                    <Button colorScheme="blue" type="submit">
                                        Send newsletter
                                    </Button>
                                </Flex>
                            </form>
                            <Divider />
                            <SimpleGrid columns={{ base: 1, md: 2 }}>
                                <Box
                                    borderRight={{ lg: "1px" }}
                                    borderBottom={{ base: "1px", lg: "none" }}
                                    borderColor={{
                                        base: "gray.200",
                                        lg: "gray.200"
                                    }}
                                    p={{ base: 0, md: 14 }}
                                    py={{ base: 7, md: 14 }}
                                    h={{ base: "50vh", lg: "100%" }}>
                                    <textarea
                                        fontSize={{
                                            base: "1.5rem",
                                            lg: "inherit"
                                        }}
                                        onChange={e =>
                                            setNewsletterMarkdown(
                                                e.target.value
                                            )
                                        }
                                        py={{ base: 2, lg: 0 }}
                                        placeholder="Newsletter content"
                                        style={{
                                            fontFamily: `"Fira Mono", monospace`,
                                            width: "100%",
                                            height: "100%"
                                        }}
                                        value={newsletterMarkdown}
                                    />
                                </Box>
                                <Box
                                    px={{ base: 0, md: 14 }}
                                    py={{ base: 0, md: 7 }}>
                                    <Prose>
                                        <p>Hi there!</p>
                                        <p>
                                            You're receiving this because you
                                            signed up for my newsletter at{" "}
                                            <a href="https://jianminchen.com">
                                                jianminchen.com
                                            </a>
                                            .
                                        </p>
                                        {newsletterHtml.length > 0 && (
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: newsletterHtml
                                                }}
                                            />
                                        )}
                                        <p>That's all,</p>
                                        <Image
                                            alt="Email signature"
                                            id="email-signature"
                                            layout="intrinsic"
                                            src={signature}
                                        />
                                        <hr />
                                        <p id="email-footer">
                                            Looking to unsubscribe? Just reply
                                            to this email.
                                        </p>
                                    </Prose>
                                </Box>
                            </SimpleGrid>
                        </TabPanel>
                        <TabPanel>
                            <TableContainer>
                                <Table size="lg" variant="simple">
                                    {!subscribers.length && (
                                        <TableCaption>
                                            No subscribers yet!
                                        </TableCaption>
                                    )}
                                    <Thead>
                                        <Tr>
                                            <Th>Email</Th>
                                            <Th>Delete</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {subscribers.map(email => (
                                            <Tr key={email}>
                                                <Td>{email}</Td>
                                                <Td>
                                                    <Box
                                                        as="button"
                                                        color="#0099ff"
                                                        onClick={() =>
                                                            deleteSubscriber(
                                                                email
                                                            )
                                                        }>
                                                        Delete
                                                    </Box>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </TabPanel>
                        <TabPanel>
                            <Divider />
                            <SimpleGrid columns={{ base: 1, md: 2 }}>
                                <Box
                                    borderRight={{ md: "1px" }}
                                    borderColor={{ md: "gray.200" }}>
                                    {pastNewsletters &&
                                        pastNewsletters.map(
                                            (newsletter, key) => (
                                                <Box
                                                    borderBottom="1px"
                                                    borderColor="gray.200"
                                                    cursor="pointer"
                                                    _hover={{
                                                        backgroundColor:
                                                            "gray.50"
                                                    }}
                                                    key={key}
                                                    onClick={() =>
                                                        setCurrentNewsletter(
                                                            key
                                                        )
                                                    }
                                                    px={{ base: 0, lg: 7 }}
                                                    py={7}>
                                                    <p>
                                                        {dayjs(
                                                            newsletter.date
                                                        ).format("YYYY-MM-DD")}
                                                    </p>
                                                    <Heading size="md">
                                                        {newsletter.subject}
                                                    </Heading>
                                                </Box>
                                            )
                                        )}
                                </Box>
                                <Box
                                    px={{ base: 0, md: 14 }}
                                    py={{ base: 0, md: 7 }}>
                                    {pastNewsletters.length ? (
                                        <Prose>
                                            <p>Hi there!</p>
                                            <p>
                                                You're receiving this because
                                                you signed up for my newsletter
                                                at{" "}
                                                <a href="https://jianminchen.com">
                                                    jianminchen.com
                                                </a>
                                                .
                                            </p>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: pastNewsletters[
                                                        currentNewsletter
                                                    ].html
                                                }}
                                            />
                                            <p>That's all,</p>
                                            <Image
                                                alt="Email signature"
                                                id="email-signature"
                                                layout="intrinsic"
                                                src={signature}
                                            />
                                            <hr />
                                            <p id="email-footer">
                                                Looking to unsubscribe? Just
                                                reply to this email.
                                            </p>
                                        </Prose>
                                    ) : (
                                        <Prose>
                                            <p>
                                                <i>No newsletters sent yet!</i>
                                            </p>
                                        </Prose>
                                    )}
                                </Box>
                            </SimpleGrid>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </ChakraProvider>
    );
}

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
        const admin = req.session.admin;
        if (!admin || !admin.signedin)
            return { redirect: { permanent: false, destination: "/login" } };

        return { props: {} };
    },
    {
        cookieName: config.AUTH_TOKEN,
        password: config.AUTH_PASSWORD,
        cookieOptions: {
            secure: config.NODE_ENV === "production"
        }
    }
);
