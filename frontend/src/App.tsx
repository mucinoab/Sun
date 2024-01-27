import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ChecklistTab from "./components/ChecklistTab.tsx";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default () => (
  <Tabs>
    <TabList>
      <Tab>Check List</Tab>
      <Tab>Itinerary</Tab>
      <Tab>Map View</Tab>
      <Tab>Split Costs</Tab>
    </TabList>

    <TabPanel>
      <h2>Any content 1</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridWeek'
        events={
          [
            { title: 'event 1', date: '2024-01-20' },
            { title: 'event 2', date: '2024-01-18' }
          ]
        }
        dateClick={info => {
          alert('Clicked on: ' + info.dateStr);
          alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
          alert('Current view: ' + info.view.type);
          info.dayEl.style.backgroundColor = 'red';
        }}
      />
    </TabPanel>

    <TabPanel forceRender={true}>
      <ChecklistTab userId="1" />
    </TabPanel>

    <TabPanel>
      <h2>Map in Here</h2>
    </TabPanel>


    <TabPanel>
      <h2>Any content 2</h2>
    </TabPanel>

  </Tabs>
);

