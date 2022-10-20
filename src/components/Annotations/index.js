import React from "react";

import { CloseRounded, MenuRounded } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { IconButton, Typography, Button } from "@mui/material";
import { AddRounded } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  menu: {
    position: "absolute",
  },
  annotation: {
    margin: "5px",
    padding: "5px",
    "&:hover": {
      backgroundColor: "rgb(200,200,200)",
    },
    transition: "all 0.2s",
    cursor: "pointer",
  },
}));

const Annotations = ({
  toggleCollapse,
  collapse,
  selected,
  editMode,
  annotateMode,
  setAnnotateMode,
  record,
  updateRecord,
}) => {
  const classes = useStyles();

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
        {!collapse && <Typography variant="h5">Annotations</Typography>}
        <IconButton
          className={classes.menu}
          style={{ color: "white" }}
          onClick={toggleCollapse}
        >
          <MenuRounded />
        </IconButton>
      </div>

      <div style={{ flex: 1 }}>
        {!collapse &&
          record?.annotations?.map((ann, ind) => {
            return (
              <div key={"annotation-" + ind} className={classes.annotation}>
                <p
                  style={{
                    margin: 0,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {record.text.substring(ann.start, ann.end + 1)}
                </p>
                <div
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>{ann.name}</div>
                  <IconButton
                    onClick={() => {
                      const ch = window.confirm("Confirm delete annotation");

                      if (!ch) return;

                      console.log({
                        ind,
                        ann: record.annotations.splice(ind, 1),
                      });

                      updateRecord({
                        ...record,
                        annotations: record.annotations.splice(ind, 1),
                      });
                    }}
                  >
                    <CloseRounded fontSize="small" />
                  </IconButton>
                </div>
              </div>
            );
          })}
      </div>

      {selected && !editMode && !annotateMode && (
        <>
          {!collapse ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  setAnnotateMode(true);
                }}
              >
                <AddRounded /> &nbsp; New Annotation
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
              <IconButton
                onClick={() => {
                  setAnnotateMode(true);
                }}
              >
                <AddRounded />
              </IconButton>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Annotations;
