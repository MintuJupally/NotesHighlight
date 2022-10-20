import React, { useState, useRef, useEffect } from "react";

import { CheckRounded, EditRounded } from "@mui/icons-material";
import {
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  DialogContentText,
} from "@mui/material";

const withLines = (text, ind) => {
  const pieces = text.split("\n");

  return pieces.map((piece, index) => (
    <React.Fragment key={`line-${ind}-${index}`}>
      {piece}
      {index !== pieces.length - 1 && <br />}
    </React.Fragment>
  ));
};

const Node = ({
  selected,
  record,
  updateRecord,
  annotateMode,
  editMode,
  setEditMode,
  setAnnotateMode,
}) => {
  const recordText = useRef(null);
  const recordSelection = useRef(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [name, setName] = useState("");
  const [color, setColor] = useState("#f42525");

  const [newAnnotation, setNewAnnotation] = useState(null);

  useEffect(() => {
    setNewAnnotation(null);
  }, [record]);

  const saveRecord = () => {
    const text = recordText.current.value;

    updateRecord({ ...record, text });
  };

  const addAnnotation = () => {
    const selection = document.getSelection().getRangeAt(0);
    const start = selection.startContainer.parentElement;
    const end = selection.endContainer.parentElement;

    if (start === end && start === recordSelection.current) {
      let s = 0,
        e = 0;

      if (selection.startContainer === selection.endContainer) {
        if (selection.startOffset !== selection.endOffset) {
          let a = -1;

          const children = start.childNodes;
          for (let i = 0; i < children.length; i++) {
            if (children[i] === selection.startContainer) {
              a = i;
              break;
            }
          }

          for (let i = 0; i < children.length; i++) {
            let len = children[i].nodeName === "BR" ? 1 : children[i].length;

            if (i < a) {
              s += len;
              e = s;
            } else if (i === a) {
              s += selection.startOffset;
              e += selection.endOffset;
            }
          }
        }
      } else {
        let a = -1,
          b = -1;

        const children = start.childNodes;
        for (let i = 0; i < children.length; i++) {
          if (a !== -1 && b !== -1) break;

          if (children[i] === selection.startContainer) a = i;
          else if (children[i] === selection.endContainer) b = i;
        }

        for (let i = 0; i < children.length; i++) {
          let len = children[i].nodeName === "BR" ? 1 : children[i].length;

          if (i < a) {
            s += len;
            e = s;
          } else if (i === a) {
            s += selection.startOffset;
            e += len;
          } else if (i < b) {
            e += len;
          } else if (i === b) {
            e += selection.endOffset;
          }
        }
      }

      setNewAnnotation({
        start: s,
        end: e,
      });

      setDialogOpen(true);
    }
  };

  const annotations = record?.annotations?.sort((a, b) => a.start - b.start);

  return (
    <div style={{ height: "100%" }}>
      <div
        className="InnerTitle"
        style={{
          display: "flex",
          justifyContent: annotateMode ? "space-between" : "flex-end",
        }}
      >
        {selected && !annotateMode && (
          <IconButton
            onClick={() => {
              if (!editMode) setEditMode(true);
              else {
                saveRecord();
                setEditMode(false);
              }
            }}
          >
            {!editMode ? (
              <EditRounded style={{ color: "white" }} />
            ) : (
              <CheckRounded style={{ color: "white" }} />
            )}
          </IconButton>
        )}

        {annotateMode && (
          <>
            <Typography variant="h5">Select text to annotate</Typography>
            <IconButton
              onClick={() => {
                addAnnotation();
                setAnnotateMode(false);
              }}
            >
              <CheckRounded style={{ color: "white" }} />
            </IconButton>
          </>
        )}
      </div>
      <div
        style={{
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100% - 72px)",
        }}
      >
        {editMode ? (
          <textarea
            ref={recordText}
            style={{
              width: "100%",
              height: "100%",
              fontSize: "20px",
              border: "none",
              resize: "none",
              outline: 0,
            }}
            defaultValue={record?.text ?? ""}
          ></textarea>
        ) : selected ? (
          record.text ? (
            <div
              style={{
                height: "100%",
                width: "100%",
                fontSize: "20px",
                overflow: "auto",
              }}
            >
              {annotations.length === 0 || annotateMode ? (
                <p ref={recordSelection}>{withLines(record.text)}</p>
              ) : (
                <p ref={recordSelection}>
                  {annotations.map((an, ind) => {
                    let start = 0;
                    if (ind > 0) {
                      start = annotations[ind - 1].end;
                    }

                    return (
                      <React.Fragment key={"piece-" + ind}>
                        {withLines(record.text.substr(start, an.start - start))}
                        <span style={{ backgroundColor: an.color ?? "yellow" }}>
                          {withLines(record.text.substring(an.start, an.end))}
                        </span>
                      </React.Fragment>
                    );
                  })}
                  {withLines(
                    record.text.substr(annotations[annotations.length - 1].end)
                  )}
                </p>
              )}
            </div>
          ) : (
            "Nothing here"
          )
        ) : (
          "Nothing selected"
        )}
      </div>

      <Dialog open={dialogOpen} fullWidth>
        <DialogTitle>Save Annotation</DialogTitle>
        <DialogContent>
          <DialogContentText>Add a name to the annotation</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="email"
            fullWidth
            variant="standard"
            value={name}
            onChange={(el) => {
              setName(el.target.value.trim());
            }}
          />
          <div
            style={{
              display: "flex",
              marginTop: "20px",
              justifyContent: "space-between",
            }}
          >
            <DialogContentText>
              Choose a color for the annotation
            </DialogContentText>
            <input
              type="color"
              style={{ width: "100px" }}
              value={color}
              onChange={(val) => {
                setColor(val.target.value);
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
              setNewAnnotation(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setDialogOpen(false);

              updateRecord({
                ...record,
                annotations: [
                  ...record.annotations,
                  { ...newAnnotation, name, color },
                ],
              });
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Node;
