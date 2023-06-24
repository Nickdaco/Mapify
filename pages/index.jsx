import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import {
  Link,
  Text,
  extendTheme,
  Flex,
  Button,
  Heading,
  Stack,
  HStack,
  VStack,
} from "@chakra-ui/react";

export default function Home() {
  const { data: session } = useSession();
  const [list, setList] = useState([]);

  return (
    <>
      <VStack
        height="100vh"
        alignItems="center"
        justifyContent="center"
        spacing={3}
      >
        <Heading as="h1" size="2xl">
          Mapify
        </Heading>
        <Heading as="h3" size="lg">
          Artist map generator
        </Heading>
        <Button
          size="lg"
          colorScheme="whatsapp"
          onClick={() => signIn("spotify", { callbackUrl: "/map" })}
        >
          Log in to Spotify
        </Button>
      </VStack>
    </>
  );
}
