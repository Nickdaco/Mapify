import Head from "next/head";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Heading,
  Tab,
  TabIndicator,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  VStack,
  Link,
  Text,
  Spinner,
  HStack,
  Button,
  Divider,
} from "@chakra-ui/react";
import { Footer } from "../components/Footer";

// Loads in the map without Server Side Rendering, avoiding error with Next.JS
const MapWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  const [data, setData] = useState(null);
  var state = {};
  const { data: session } = useSession();

  useEffect(() => {
    // on page load, find the artist locations and plot them on the map
    const fetchData = async () => {
      const response = await fetch("/api/artist-locations");
      const responseData = await response.json();
      setData(responseData.items); // Set the fetched data in state
    };

    fetchData();
  }, []);
  return (
    <div>
      <VStack
        height="100vh"
        alignItems="center"
        justifyContent="center"
        spacing={3}
      >
        <Heading>{session?.token?.name}&apos;s Music Map</Heading>
        {data ? (
          <>
            <Tabs position="relative" variant="soft-rounded"></Tabs>
            <MapWithNoSSR coordinates={data} />
            <Divider />
            <Footer />
          </>
        ) : (
          <div>
            {/* <Text>Loading...</Text> */}
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </div>
        )}
      </VStack>
    </div>
  );
}
