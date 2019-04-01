import debounce from '../../utils/debounce.js'
import {
  getNumUnit
} from '../../utils/changeUnit.js'
import EventBus from '../../utils/pubsub.js'


let timeTable = [{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0915",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0916",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0917",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0918",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0919",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0920",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0921",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0922",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0923",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0924",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0925",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0926",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0927",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0928",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0929",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0930",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0931",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0932",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0933",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0934",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0935",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0936",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0937",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0938",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0939",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0940",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0941",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0942",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0943",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0944",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0945",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0946",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0947",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0948",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0949",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0950",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0951",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0952",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0953",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0954",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0955",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0956",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0957",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0958",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"0959",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1000",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1001",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1002",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1003",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1004",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1005",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1006",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1007",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1008",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1009",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1010",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1011",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1012",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1013",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1014",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1015",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1016",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1017",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1018",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1019",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1020",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1021",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1022",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1023",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1024",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1025",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1026",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1027",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},
{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1028",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1029",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1030",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1031",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1032",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1033",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1034",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1035",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1036",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1037",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1038",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1039",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1040",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1041",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1042",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1043",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1044",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1045",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1046",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1047",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1048",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1049",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1050",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1051",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1052",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1053",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1054",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1055",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1056",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1057",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1058",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1059",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1100",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1101",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1102",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1103",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1104",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1105",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1106",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1107",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1108",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1109",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1110",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1111",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1112",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1113",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1114",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1115",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1116",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1117",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1118",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1119",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1120",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1121",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1122",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1123",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1124",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1125",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1126",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1127",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1128",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1129",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1130",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1301",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1302",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1303",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1304",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1305",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1306",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1307",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1308",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1309",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1310",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1311",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1312",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1313",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1314",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1315",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1316",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1317",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1318",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1319",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1320",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1321",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1322",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1323",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1324",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1325",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1326",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1327",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1328",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1329",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1330",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1331",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1332",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1333",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1334",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1335",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1336",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1337",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1338",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1339",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1340",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1341",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1342",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1343",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1344",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1345",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1346",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1347",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1348",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}, {
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1349",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1350",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1351",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1352",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1353",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1354",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1355",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1356",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1357",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1358",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1359",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1400",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1401",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1402",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1403",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1404",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1405",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1406",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1407",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1408",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1409",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1410",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1411",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1412",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1413",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1414",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1415",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1416",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1417",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1418",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1419",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1420",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1421",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1422",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1423",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1424",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1425",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1426",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1427",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1428",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1429",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1430",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1431",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1432",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1433",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1434",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1435",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1436",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1437",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1438",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1439",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1440",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1441",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1442",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1443",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1444",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1445",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1446",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1447",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1448",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1449",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1450",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1451",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1452",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1453",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1454",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1455",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1456",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1457",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1458",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1459",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
},{
  averageDa:0,
  averagePrice:"0.00",
  averagey:0,
  da:0,
  date:"1500",
  dealA:0,
  dealN:0,
  dealPrice:"0.00",
  dn:0,
  x:0,
  y:0,
}]
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isStock: {
      type: Boolean,
      value: false,
      observer(newData) {

      }
    },
    height: {
      type: Number,
      value: 300,
      observer(newData) {
        this.data.yRange = [0, newData]
        this.doDraw()
      }
    },
    width: {
      type: Number,
      value: 200,
      observer(newData) {
        this.data.xRange = [0, newData]
        
        let gap = (this.data.xRange[1] - this.data.xRange[0]) / (this.data.timeIndex - 1)

        this.data.gap = gap
        if (this.data.currentIndex >= 0 && this.data.showCrosshair) {
          this.moveCrosshair(this.data.currentIndex, true)
        }
        this.doDraw()
      }
    },
    drawData: {
      type: Object,
      value: {},
      observer(newData, oldData) {
        if(newData.data.length === 0) {
          this.clearCanvas()
        }
        if (newData.data.length > 0 && !this.data.firstInit) {
          this.data.firstInit = true
          if (this.data.kSettingItem.fsHair) {
            this.data.showCrosshair = true
            let index = newData.data.length - 1
            if (!this.data.kSettingItem.jhjj) {
              index -= 15
            }
            this.moveCrosshair(index)
          }
        }
        
        let temp = {}
        let initTimeTable = []
        // 清空原先数据
        for(let i = 0; i < timeTable.length; i++) {
          initTimeTable.push(Object.assign({}, timeTable[i]))
        }
        // 重新赋值
        for(let i = 0; i < newData.data.length; i++) {
          temp = newData.data[i]
          for(let j = 0; j < initTimeTable.length; j++) {
            if(temp.date === initTimeTable[j].date) {
              initTimeTable[j] = Object.assign({}, initTimeTable[j], temp)
              break
            }
          }
        }
        this.data.data = newData
        this.data.data.data = initTimeTable
        
        this.doDraw()
      }
    },
    kSettingItem: {
      type: Object,
      value: {},
      observer(newData) {
        if (newData.jhjj == true) {
          this.openjhjj()
        } else {
          this.closejhjj()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hideCrossHairHandle: null,
    showCrosshair: false,
    crosshair: {
      x: 100,
      y: 0
    },
    data: {
      pcp: 0
    },
    currentIndex: -1,
    xRange: [0, 300],
    gap: 1,
    callAuctionCloseArr: [1030, 1130, 1400],
    callAuctionOpenArr: [930, 1030, 1130, 1400],
    yRange: [0, 200],
    xGrid: [1030, 1130, 1400],
    yDomain: [],
    firstInit: false,
    start: [9, 30],
    timeIndex: 241,
    currentTimeIndex: 0,
    chaPercent: 0,
  },
  //事件处理函数


  /**
   * 组件的方法列表
   */
  lifetimes: {
    attached() {
      let kSettingItem = wx.getStorageSync('kSettingItem')
      if (kSettingItem) {
        this.setData({
          kSettingItem,
        })
      }


      this.doDraw()
    }
  },

  pageLifetimes: {
    show() {
    }
  },
  methods: {
    clearCanvas() {
      const ctx = wx.createCanvasContext('firstCanvas', this)
      ctx.draw()
    },
    doDraw() {
      
      
      if (Object.keys(this.data.data).length !== 0 && this.data.data.data.length) {
        this.preprocess()
      }
      this.draw()
    },
    closejhjj() {

      this.data.xGrid = this.data.callAuctionCloseArr
      this.data.start = [9, 30]
      this.data.timeIndex = 241
      this.data.openjhjjFlag = false
      this.data.currentTimeIndex = this.data.currentTimeIndex - 15

      this.doDraw()
    },
    moveLeft() {
      this.move('left')
    },
    getNextDataIndex(index, step) {
      let time = this.transferIndex2Time(index)
      let realIndex = index
      for (let i = 0; i < this.data.data.data.length; i++) {
        if (this.data.data.data[i].date === time) {
          realIndex = i
        }
      }
      realIndex += step
      if(realIndex < 0) {
        realIndex = 0
      } else if(realIndex >= this.data.data.data.length) {
        realIndex = this.data.data.data.length - 1
      }
      return this.transfer2TimeIndex(this.data.data.data[realIndex].date)
    },
    move(direction) {
      if(!this.data.showCrosshair) {
        return
      }
      let step = 0
      let index = this.data.currentIndex 
      if(direction == 'left') {
        step = -1
      } else {
        step = 1
      }
      index = this.getNextDataIndex(index, step)
      // if(step < 0 && index > 0) {
      //   index += step
      //   let time = this.transferIndex2Time(index)
      //   this.data.currentIndex = index
      //   this.moveCrosshair(index, true)
      // } else if(index < this.data.currentTimeIndex && step > 0){
      //   index += step
        // let time = this.transferIndex2Time(index)
        
        if(this.data.currentIndex == index) {
          if(direction == 'left') {
            EventBus.emit('diagramUnableLeft')
          } else {
            EventBus.emit('diagramUnableRight')
          }
          return
        }
        this.data.currentIndex = index
        this.moveCrosshair(index, true)
      // }

    },
    moveRight() {
      this.move('right')
    },
    openjhjj() {
      this.data.openjhjjFlag = true
      this.data.xGrid = this.data.callAuctionOpenArr
      this.data.start = [9, 15]
      this.data.timeIndex = 256
      this.data.currentTimeIndex = this.data.currentTimeIndex + 15

      this.doDraw()
    },
    draw() {
      const ctx = wx.createCanvasContext('firstCanvas', this)
      if (this.data.showCrosshair) {
        this.drawCrosshair(ctx)
      }

      if (Object.keys(this.data.data).length !== 0 && this.data.data.data.length && this.data.data.pcp) {
        if (this.data.kSettingItem.fsjx) {
          this.drawAPL(ctx)
        }
        ctx.beginPath()
        ctx.closePath()
        this.drawFline(ctx)
        this.drawText(ctx)
      }
      // this.drawContainerRect(ctx)
      // 
      // if(this.data.data.length > 0) {
        
      // }
      this.drawGrid(ctx)
      ctx.draw()
    },
    closeCrosshair() {
      EventBus.emit('closeDiagram')
      this.data.showCrosshair = false
      this.draw()
    },
    drawCrosshair(ctx) {


      ctx.moveTo(this.data.crosshair.x, 0)
      ctx.lineTo(this.data.crosshair.x, this.data.yRange[1])
      // ctx.moveTo(0, this.data.crosshair.y)
      // ctx.lineTo(this.data.xRange[1], this.data.crosshair.y)
      ctx.setStrokeStyle('black')
      ctx.stroke()
    },
    tranferX2Index(x) {
      let index = Math.round(x / this.data.gap)
      if (index > this.data.currentTimeIndex) {
        index = this.data.currentTimeIndex
      } else if (index < 0) {
        index = 0
      }
      return index
    },
    setCrosshair(index) {

      let time = this.transferIndex2Time(index)
      let price
      let tempData
      for (let i = 0; i < this.data.data.data.length; i++) {
        if (this.data.data.data[i].date === time) {
          price = this.data.data.data[i].dealPrice
          tempData = Object.assign({}, this.data.data.data[i])
        }
      }
      tempData.date = tempData.date.replace(/(\d{2})(\d{2})/, "$1:$2")
      tempDate.price = getNumUnit(tempDate.price)
      tempData.dealA = getNumUnit(tempData.dealA)
      tempData.dealN = getNumUnit(tempData.dealN)
      tempData.averageDa = tempData.averageDa

      let y = this.transfer2y(price)
      let xLength = index * this.data.gap
      if (typeof e !== 'number') {
        this.triggerEvent('drawcrosshair', {
          x: xLength,
          currentInfo: tempData
        })
      }

      if (!this.data.showCrosshair) {
        this.triggerEvent('showcurrentInfo', {
          currentInfo: tempData
        })
      }
      this.data.showCrosshair = true
      this.data.crosshair = {
        x: xLength,
        y
      }
    },
    moveCrosshair: debounce(function(e, isDate = false) {
      EventBus.emit('resetDiagram')
      let x 
      if(typeof e === 'number') {
        x = e
      } else {
        x = e.changedTouches[0].x
      }

      let index
      if (!isDate) {
        index = this.tranferX2Index(x)
      } else {
        index = e
      }
      this.data.currentIndex = index
      let time = this.transferIndex2Time(index)
      let price
      let tempData
      for (let i = 0; i < this.data.data.data.length; i++) {
        if (this.data.data.data[i].date === time) {
          price = this.data.data.data[i].dealPrice
          tempData = Object.assign({}, this.data.data.data[i])
        }
      }
      tempData.date = tempData.date.replace(/(\d{2})(\d{2})/, "$1:$2")

      tempData.dealA = getNumUnit(tempData.dealA)
      tempData.dealN = getNumUnit(tempData.dealN)
      tempData.averageDa = tempData.averageDa
      tempData.rise = (parseFloat(tempData.dealPrice) - parseFloat(this.data.data.pcp)) / parseFloat(this.data.data.pcp) * 100
      tempData.rise = (tempData.rise).toFixed(2)
      let y = this.transfer2y(price)

      let xLength = index * this.data.gap
      if (typeof e !== 'number' || !this.firstInit) {
        this.triggerEvent('drawcrosshair', {
          x: xLength
        })
      }

      if (!this.data.showCrosshair) {
        this.triggerEvent('showcurrentInfo')
      }
      EventBus.emit('changecurrentInfo', tempData)
      this.data.showCrosshair = true
      this.data.crosshair = {
        x: xLength,
        y
      }
      this.draw()
    }, 0),
    preprocess() {
      if(!this.data.data.pcp) {
        return 
      }
      let data = this.data.data
      
      let zuidacha = (data.pcp * 0.02).toFixed(2)
      let lastDate = data.data[data.data.length - 1].date
      let currentTimeIndex = this.transfer2TimeIndex(lastDate)

      this.data.currentTimeIndex = currentTimeIndex
      let zuidacha1 = Math.abs(data.pcp - data.hp).toFixed(2)
      let zuidacha2 = Math.abs(data.pcp - data.lp).toFixed(2)
      if (parseFloat(zuidacha1) >= parseFloat(zuidacha2)) {
        zuidacha = parseFloat(zuidacha1) > parseFloat(zuidacha) ? parseFloat(zuidacha1) : parseFloat(zuidacha)
      } else {
        zuidacha = parseFloat(zuidacha2) > parseFloat(zuidacha) ? parseFloat(zuidacha2) : parseFloat(zuidacha)
      }
      let zhi = parseFloat(zuidacha) + parseFloat(data.pcp)
      let chaPercent = (parseFloat(zuidacha) / parseFloat(data.pcp) * 100).toFixed(2)

      let yDomain = [parseFloat((data.pcp - zuidacha).toFixed(2)), parseFloat(zhi.toFixed(2))]
      
      this.data.yDomain = yDomain
      this.data.chaPercent = parseFloat(chaPercent)
      for (let i = 0, length = data.data.length; i < length; i++) {
        
        data.data[i].x = this.transfer2x(data.data[i].date)
        data.data[i].y = this.transfer2y(data.data[i].dealPrice)
        data.data[i].averagey = this.transfer2y(data.data[i].averagePrice)
      }
      this.data.data = data
    },

    drawContainerRect(ctx) {

      ctx.setStrokeStyle('black')
      ctx.strokeRect(0, 0, this.data.xRange[1], this.data.yRange[1])

    },
    drawTimeLine(time, ctx) {
      let x = this.transfer2x(time)
      // ctx.setStrokeStyle('black')
      ctx.beginPath()
      ctx.setLineDash([3, 3], 2)
      ctx.moveTo(x, 0)
      ctx.lineTo(x, this.data.yRange[1])
      ctx.closePath()
      ctx.stroke()
    },
    drawGrid(ctx) {
      let timeArr = this.data.xGrid
      ctx.setStrokeStyle('rgba(186, 186, 186, 1)')
      for (let i = 0, length = timeArr.length; i < length; i++) {
        this.drawTimeLine(timeArr[i], ctx)
      }
      const midY = this.data.yRange[1] / 2
      const firstY = (this.data.yRange[0] + midY) / 2
      const lastY = (this.data.yRange[1] + midY) / 2
      // ctx.beginPath()
      ctx.beginPath()
      ctx.setLineDash([3, 3], 2)
      ctx.moveTo(0, midY)
      ctx.lineTo(this.data.xRange[1], midY)
      ctx.moveTo(0, firstY)
      ctx.lineTo(this.data.xRange[1], firstY)
      ctx.moveTo(0, lastY)
      ctx.lineTo(this.data.xRange[1], lastY)
      ctx.closePath()
      ctx.stroke()
      ctx.setLineDash([0, 0], 0)
    },
    preDraw() {
      const ctx = wx.createCanvasContext('firstCanvas', this)
      this.drawGrid(ctx)
      ctx.draw()
    },
    drawText(ctx) {
      
      const midY = this.data.yRange[1] / 2
      const fontSize = 10
      const yEnd = this.data.yRange[1]
      const xEnd = this.data.xRange[1] - 3 * fontSize
      ctx.setFontSize(fontSize)
      
      let TextInfo

      if(this.data.isStock) {
        TextInfo = [{
          text:this.data.data.pcp,
          x: xEnd,
          y: midY + fontSize/3,
          color: 'gray'
        }, {
          text:this.data.yDomain[1],
          x: xEnd,
          y:fontSize,
          color: 'gray'
        }, {
          text:this.data.yDomain[0],
          x: xEnd,
          y: yEnd - fontSize/3,
          color: 'gray'
        }]
      } else {
        TextInfo = [{
          text: Math.round(this.data.data.pcp),
          x: xEnd,
          y: midY + fontSize/3,
          color: 'gray'
        }, {
          text: Math.round(this.data.yDomain[1]),
          x: xEnd,
          y:fontSize,
          color: 'gray'
        }, {
          text: Math.round(this.data.yDomain[0]),
          x: xEnd,
          y: yEnd - fontSize/3,
          color: 'gray'
        }]
      }
      for(let i = 0; i < TextInfo.length; i++) {
        ctx.setFillStyle(TextInfo[i].color)
        ctx.fillText(TextInfo[i].text, TextInfo[i].x, TextInfo[i].y)
      }
    },
    drawAPL(ctx) {
      let data = this.data.data.data
      let i = 0
      while (parseInt(data[i].date) < 930) {
        i++
      }
      ctx.beginPath()
      ctx.moveTo(data[i].x, data[i].averagey)

      for (let length = data.length; i < length; i++) {
        ctx.lineTo(data[i].x, data[i].averagey)

      }

      ctx.setStrokeStyle('orange')
      ctx.stroke()
      ctx.closePath()
    },
    drawFline(ctx) {
      let data = this.data.data.data
      let startIndex = 0
      for (let i = 0, length = data.length; i < length; i++) {
        if(data[i].averageDa != 0) {
          startIndex = i
          break
        }
      }
      
      ctx.moveTo(data[startIndex].x, data[startIndex].y)
      let prevData = data[startIndex]
      for (let i = startIndex + 1, length = data.length; i < length; i++) {
        
        if(data[i].dealA !== 0 && parseInt(data[i].price) !== 0) {
          ctx.lineTo(data[i].x, data[i].y)
          prevData = data[i]
        } else if(data[i].averageDa !== 0){
          
          ctx.lineTo(data[i].x, prevData.y)
        }
        
      }

      ctx.setStrokeStyle('blue')
      ctx.setLineDash([0, 0], 0)
      ctx.stroke()
      ctx.closePath()
    },
    transferIndex2Time(index) {
      if (this.data.openjhjjFlag) {
        index = index + 15
      } else {
        index = index + 30
      }
      if (index > 150) {
        index += 90
      }
      let hours = Math.floor(index / 60) + 9

      let min = index % 60
      return String(100 + hours).slice(1) + String(100 + min).slice(1)
    },
    transfer2y(y) {
      let yRange = this.data.yRange
      let yDomain = this.data.yDomain
      return (yDomain[1] - y) / (yDomain[1] - yDomain[0]) * (yRange[1] - yRange[0]) + yRange[0]
    },
    transfer2TimeIndex(time) {
      let start = this.data.start
      let date = []

      let dataDate = parseInt(time)
      date[0] = Math.floor(dataDate / 100)

      date[1] = dataDate % 100

      let index = (date[0] - start[0]) * 60 + (date[1] - start[1])
      if (date[0] >= 13) {
        index = index - 90
      }
      return index
    },
    transfer2x(time) {
      let index = this.transfer2TimeIndex(time)
      let gap = this.data.gap
      
      return gap * index
    }
  }
})