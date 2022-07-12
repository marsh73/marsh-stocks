import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import green from "@mui/material/colors/green";
import NumberFormat from "react-number-format";

function TickerDataValue({meta}) {
  console.log('meta', meta)
  let pre = '';
  let val = meta.value;

  if (meta.style === 'currency') {
    pre = '$';
    val = Math.trunc(meta.value);
  }

  return <NumberFormat thousandSeparator={true} displayType={'text'} prefix={pre} value={val} />
}

export default function TickerDrawer({ ticker, title, data, news }) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${ticker}-daily`}
        id={`${ticker}-daily-header`}
        sx={{
          borderBottom: 1,
          borderBottomColor: '#ccc',
          '& .Mui-expanded': {
            margin: '0 0',
            color: green[900]
          },
        }}
      >
       {title}
      </AccordionSummary>
      <AccordionDetails>

        {/* NEWS ONLY */}
        {data && news && (
          <List dense>
            {data.map((artcl, i) => {
              return (
                <ListItem
                  disableGutters
                  dense
                  disablePadding
                  key={`${ticker}-${title}-${i}`}
                >
                  <Link
                    href={artcl.article_url}
                    underline="hover"
                    target="_blank"
                    rel="noopener"
                    >
                    <ListItemText
                      primary={artcl?.title}
                      secondary={artcl?.published_utc}
                      secondaryTypographyProps={{variant: "subtitle2"}}
                      />
                    </Link>
                </ListItem>
              );
            })}
        </List>
        )}

        {data && !news && (
          <List dense>
            {Object.keys(data).map((key, i) => {
              return (
                <ListItem
                  disableGutters
                  dense
                  disablePadding
                  key={`${ticker}-${title}-${i}`}
                >
                  <Typography variant="subtitle1">
                    {data[key].label}:
                  </Typography>
                  <Typography variant="subtitle2" ml={1} color={green[300]}>
                    <TickerDataValue meta={data[key]}/>
                  </Typography>
                </ListItem>
              );
            })}
          </List>
        )}


      {!data && !news && (
        <Box>
            No data is available for this Ticker
        </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
