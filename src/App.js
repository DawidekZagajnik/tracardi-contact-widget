import React from 'react';
import "regenerator-runtime/runtime";
import { Snackbar, Button, SnackbarContent, Box, TextField, Typography, IconButton, CircularProgress } from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";

function App({domElement}) {

    const [open, setOpen] = React.useState(true);
    const [contactData, setContactData] = React.useState("");
    const [validData, setValidData] = React.useState(true);
    const [sending, setSending] = React.useState(false);

    const message = domElement.getAttribute("data-message");
    const contactType = domElement.getAttribute("data-contact-type");
    const apiUrl = domElement.getAttribute("data-api-url");
    const sourceId = domElement.getAttribute("data-source-id");
    const profileId = domElement.getAttribute("data-profile-id");
    const sessionId = domElement.getAttribute("data-session-id");
    const eventType = domElement.getAttribute("data-event-type");
    const darkTheme = domElement.getAttribute("data-theme") === "dark";
    const positionHorizontal = domElement.getAttribute("data-position-horizontal");
    const positionVertical = domElement.getAttribute("data-position-vertical");
    const saveEvent = domElement.getAttribute("data-save-event") === "yes";

    var placeholder;
    var regex;

    if (contactType === "email") {
        placeholder = "Email address";
        regex = "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$";
    }
    else if (contactType === "phone") {
        placeholder = "Phone number";
        regex = "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$";
    }

    const sendEvent = async () => {

        if (contactData.match(regex) != null) {
            setSending(true);
            setValidData(true);
            const response = await fetch(`${apiUrl}/track`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "source": {
                        "id": sourceId
                    },
                    "session": {
                        "id": sessionId
                    },
                    "profile": {
                        "id": profileId
                    },
                    "context": {},
                    "properties": {},
                    "events": [
                        {
                            "type": eventType,
                            "properties": {
                                "contact": contactData
                            },
                            "options": {
                                "saveEvent": saveEvent
                            }
                        }
                    ],
                    "options": {}
                })
            }).catch(error => console.log(error))
            const data = response && await response.json();
            console.log(data);

            setOpen(false);
        }
        else setValidData(false);
    }

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            setOpen(false);
        }
    }

    React.useEffect(() => {

    })

    return (
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: positionVertical, horizontal: positionHorizontal }}
            onClose={handleClose}
        >
            <SnackbarContent 
                style={{
                    backgroundColor: darkTheme ? "#343434" : "#ffffff",
                    maxWidth: 600
                }}
                message={
                    <Box>
                        <IconButton style={{ 
                            color: darkTheme ? "#ffffff" : "#343434",
                            position: "absolute",
                            top: 5,
                            right: 5 
                        }} size="small" onClick={() => setOpen(false)}>
                            <CloseOutlined />
                        </IconButton>
                        <Box
                            sx={{
                                color: darkTheme ? "#ffffff" : "#343434",
                                marginTop: 5,
                                marginRight: 75,
                                marginBottom: 10
                            }}
                        >
                            <Typography variant="subtitle1" color="inherit">{message}</Typography>
                        </Box>
                        <Box
                            sx={{
                                marginRight: 75,
                                marginBottom: validData ? 24 : 0
                            }}
                        >
                            <TextField 
                            helperText={validData ? "" : "Given contact data is invalid."}
                            error={!validData}
                            fullWidth={true} 
                            placeholder={placeholder} 
                            variant="standard" 
                            size="small"
                            InputProps={{
                                style: {
                                    color: darkTheme ? "#ffffff" : "#343434"
                                }
                            }}
                            onChange={event =>  setContactData(event.target.value.replaceAll(" ", ""))}
                            /> 
                        </Box>
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 40,
                                right: 10,
                                color: darkTheme ? "#ffffff" : "#343434"
                            }}
                        >
                            <Button 
                            variant="outlined" 
                            color="inherit" 
                            onClick={() => sendEvent()}
                            style={{
                                width: 45
                            }}
                            >
                                {sending ? <CircularProgress size={24} color="inherit"/> : "SEND"}
                            </Button>
                        </Box>
                    </Box>
                }
            />
        </Snackbar>
    );
}

export default App;
