import React, { useEffect } from "react";

import { AddRounded, MenuRounded } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { Button, IconButton, Typography } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  menu: {
    position: "absolute",
  },
  record: {
    margin: "5px",
    padding: "5px",
    "&:hover": {
      backgroundColor: "rgb(200,200,200)",
    },
    transition: "all 0.2s",
    cursor: "pointer",
  },
}));

const Records = ({
  toggleCollapse,
  collapse,
  records,
  updateRecords,
  selectRecord,
  selectedRecord,
}) => {
  const classes = useStyles();

  useEffect(() => {
    if (records != null) {
      console.log({ records });

      localStorage.setItem("records", JSON.stringify(records));
    }
  }, [records]);

  const addRecord = () => {
    const newRecord = {
      text: null,
      annotations: [],
    };

    updateRecords([...records, newRecord]);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <div className="InnerTitle">
        <IconButton
          className={classes.menu}
          style={{ color: "white" }}
          onClick={toggleCollapse}
        >
          <MenuRounded />
        </IconButton>
        {!collapse && <Typography variant="h5">Records </Typography>}
      </div>

      <div style={{ flex: 1 }}>
        {records?.map((record, index) => {
          if (!collapse)
            return (
              <div
                key={"record-" + index}
                className={classes.record}
                style={{
                  backgroundColor:
                    selectedRecord === index ? "rgb(207, 225, 255)" : "white",
                  fontWeight: selectedRecord === index ? "bold" : "400",
                }}
                onClick={() => {
                  selectRecord(index);
                }}
              >
                <p
                  style={{
                    whiteSpace: "nowrap",
                    margin: 0,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {record.text ?? "New Record"}
                </p>
              </div>
            );

          return (
            <div
              key={"record-" + index}
              className={classes.record}
              onClick={() => {
                selectRecord(index);
              }}
              style={{
                textAlign: "center",
                backgroundColor:
                  selectedRecord === index ? "rgb(207, 225, 255)" : "white",
                fontWeight: selectedRecord === index ? "bold" : "400",
              }}
            >
              <p style={{ padding: 0, margin: 0 }}>{index + 1}</p>
            </div>
          );
        })}
      </div>

      {!collapse ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          <Button variant="outlined" onClick={addRecord}>
            <AddRounded /> &nbsp; Add Record
          </Button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          <IconButton onClick={addRecord}>
            <AddRounded />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default Records;
