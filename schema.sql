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
Insert into ITEM (content, COMPLETE, ORDINALITY, PARENT_LIST) values ('Well defined api', true, 2, 1);

