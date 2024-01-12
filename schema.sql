DROP TABLE IF EXISTS LIST;
DROP TABLE IF EXISTS ITEM;

CREATE TABLE IF NOT EXISTS LIST (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  TITLE TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ITEM (
  ID INTEGER not null PRIMARY KEY AUTOINCREMENT,
  CONTENT TEXT,
  COMPLETE BOOLEAN not null default false,

  ORDINALITY INT NOT NULL, 
  PARENT_LIST INTEGER NOT NULL,
  FOREIGN KEY(PARENT_LIST) REFERENCES LIST(ID)
);

-- Mock data
Insert into List (title) values ('Checklisr'), ('Itinerary'), ('Split Costs'), ('Fly.io'), ('Use');
Insert into ITEM (content, COMPLETE, ORDINALITY, PARENT_LIST) values ('DB schema', false, 0, 1);
Insert into ITEM (content, COMPLETE, ORDINALITY, PARENT_LIST) values ('CRUD METhods', false, 1, 1);
Insert into ITEM (content, COMPLETE, ORDINALITY, PARENT_LIST) values ('Add item to list', false, 2, 1);
Insert into ITEM (content, COMPLETE, ORDINALITY, PARENT_LIST) values ('remove item from list', false, 3, 1);
Insert into ITEM (content, COMPLETE, ORDINALITY, PARENT_LIST) values ('edit list', false, 4, 1);
Insert into ITEM (content, COMPLETE, ORDINALITY, PARENT_LIST) values ('Create new list', false, 5, 1);
Insert into ITEM (content, COMPLETE, ORDINALITY, PARENT_LIST) values ('styles', false, 6, 1);

Insert into ITEM (content, COMPLETE, ORDINALITY, PARENT_LIST) values ('Good Plan', false, 0, 2);

Insert into ITEM (content, COMPLETE, ORDINALITY, PARENT_LIST) values ('Something', false, 0, 3);

Insert into ITEM (content, COMPLETE, ORDINALITY, PARENT_LIST) values ('CRDT', false, 0, 4);
Insert into ITEM (content, COMPLETE, ORDINALITY, PARENT_LIST) values ('Websocket setup to comunicate changes', false, 1, 4);

Insert into ITEM (content, COMPLETE, ORDINALITY, PARENT_LIST) values ('Something', false, 0, 5);
