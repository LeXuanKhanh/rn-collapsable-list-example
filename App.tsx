import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, FlatList, Button, Dimensions } from "react-native";
import { CollapsibleItem, CollapsibleItemV2 } from "./CollapsibleItem";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type ItemData = {
  id: string;
  title: string;
  content: string;
};

const generateDataItems = (count: number): ItemData[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: (index + 1).toString(),
    title: `Item ${index + 1}`,
    content: `Content for item ${index + 1}`,
  }));
};

const data: ItemData[] = generateDataItems(200);

export default function App() {
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});

  /* 
    work around for stutter when slow scrolling due to change height when recycling
    increase the number of render distance to render more item outside viewport
  */
  const drawDistance = useMemo(() => {
    const height = Dimensions.get("window").height;
    console.log("device height: ", height);
    console.log("draw distance: ", height * 3);
    return height * 3;
  }, []);

  const handleToggle = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.container}>
        <FlashList
          data={data}
          renderItem={({ item }) => (
            <CollapsibleItemV2
              item={item}
              expanded={!!expandedItems[item.id]}
              onToggle={handleToggle}
            />
          )}
          extraData={expandedItems}
          keyExtractor={(item) => item.id}
          estimatedItemSize={42.7}
          drawDistance={drawDistance}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "blue",
  },
});
