import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import Annotations from "../../components/Annotations";
import Records from "../../components/Records";
import Note from "../../components/Note";

const useStyles = makeStyles((theme) => ({
  window: {
    border: "10px solid rgb(230, 230, 230)",
    height: "100vh",
    boxSizing: "border-box",
  },
  windowOpen: {
    border: "10px solid rgb(230, 230, 230)",
    height: "100vh",
    boxSizing: "border-box",
    width: "300px",
  },
  windowClose: {
    border: "10px solid rgb(230, 230, 230)",
    height: "100vh",
    boxSizing: "border-box",
    width: "80px",
  },
}));

const Notes = () => {
  const classes = useStyles();

  const [recordsCollapse, setRecordsCollapse] = useState(false);
  const [annotationsCollapse, setAnnotationsCollapse] = useState(false);

  const [records, setRecords] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(-1);

  const [annotateMode, setAnnotateMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const fetchRecords = () => {
    const recordsString = localStorage.getItem("records");

    let recs = [];
    try {
      const recordsArray = JSON.parse(recordsString);

      if (!Array.isArray(recordsArray)) {
        recs = [];
      } else recs = [...recordsArray];
    } catch (err) {
      recs = [];
    }

    setRecords(recs);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div
          className={
            !recordsCollapse ? classes.windowOpen : classes.windowClose
          }
        >
          <Records
            records={records}
            toggleCollapse={() => {
              setRecordsCollapse((val) => !val);
            }}
            collapse={recordsCollapse}
            updateRecords={(data) => setRecords(data)}
            selectRecord={(index) => setSelectedRecord(index)}
            selectedRecord={selectedRecord}
          />
        </div>
        <div className={classes.window} style={{ flex: 1 }}>
          <Note
            annotateMode={annotateMode}
            selected={selectedRecord !== -1}
            record={selectedRecord === -1 ? null : records[selectedRecord]}
            updateRecord={(rec) =>
              setRecords(
                records.map((el, ind) => (ind === selectedRecord ? rec : el))
              )
            }
            editMode={editMode}
            setEditMode={setEditMode}
            setAnnotateMode={(mode) => {
              setAnnotateMode(mode);
            }}
          />
        </div>
        <div
          className={
            !annotationsCollapse ? classes.windowOpen : classes.windowClose
          }
        >
          <Annotations
            toggleCollapse={() => {
              setAnnotationsCollapse((val) => !val);
            }}
            collapse={annotationsCollapse}
            selected={selectedRecord !== -1}
            record={selectedRecord === -1 ? null : records[selectedRecord]}
            setAnnotateMode={(mode) => {
              setAnnotateMode(mode);
            }}
            annotateMode={annotateMode}
            editMode={editMode}
            updateRecord={(rec) => {
              console.log({ rec });

              setRecords(
                records.map((el, ind) => (ind === selectedRecord ? rec : el))
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Notes;
