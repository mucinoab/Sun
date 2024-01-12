import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ChecklistTab from "./components/ChecklistTab.tsx";

export default () => (
  <Tabs>
    <TabList>
      <Tab>Check List</Tab>
      <Tab>Itinerary</Tab>
      <Tab>Split Costs</Tab>
    </TabList>

    <TabPanel>
      <ChecklistTab userId="1" />
    </TabPanel>

    <TabPanel>
      <h2>Any content 1</h2>
    </TabPanel>

    <TabPanel>
      <h2>Any content 2</h2>
    </TabPanel>
  </Tabs>
);

