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
  return (
    <VStack
      height="100vh"
      alignItems="center"
      justifyContent="center"
      spacing={2}
    >
      <Heading>About Mapify: NOTE THIS PAGE IS A WORK IN PROGRESS, sneaky if u found it :o</Heading>
      <Text>Mapify is a tool that displays the origins and birthplaces of the users top 50 artists of all time</Text>
      <Heading>FAQ</Heading>
      <Heading size='md'>Why cant I view artits with overlapping locations?</Heading>
      <Text>Right now thats a work in progress</Text>
      <Heading size='md'>I've noticed some of my top artists are missing! Why is that?</Heading>
      <Text>Theres two reasons this could be happening, 1: The artist isnt on Wikipedia and/or cant be parsed on wikipedia. 2: The geocoding API im using cant find the location. 
        In both of these cases im working on a fix
      </Text>

    </VStack>
  );
}
