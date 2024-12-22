import {Box, FormControl, InputLabel, MenuItem, Select, Slider, Typography} from "@mui/material";
import {ReactElement} from "react";
import {DataSet} from "../EdgeBundling/EdgeBundling.types.ts";

type UserControlsProps = {
    setK: (k: number) => void;
    k: number;
    setD: (d: number) => void;
    d: number;
    setNumSegments: (numSegments: number) => void;
    numSegments: number;
    setDataSet: (dataSet: DataSet) => void;
    dataSet: DataSet;
};

function UserControls(
    { setK, k, setD, d, setNumSegments, numSegments, dataSet, setDataSet }: UserControlsProps
): ReactElement {
    return (
    <Box
        sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(68, 68, 68, 0.7)',
            borderRadius: '8px',
            padding: '16px',
            width: '12rem',
        }}
    >
        <Typography variant="h6" fontSize={18} gutterBottom>
            Parameters
        </Typography>

        <Box sx={{ marginBottom: '16px' }}>
        <FormControl fullWidth style={{ marginTop: '16px' }}>
            <InputLabel>Data Set</InputLabel>
            <Select
                sx={{
                    color: 'white',
                }}
                value={dataSet}
                onChange={(e) => setDataSet(e.target.value as DataSet)}
                label="Data Set"
            >
                <MenuItem value={DataSet.SMALL}>Small</MenuItem>
                <MenuItem value={DataSet.MEDIUM}>Medium</MenuItem>
                <MenuItem value={DataSet.FULL}>Full</MenuItem>
            </Select>
        </FormControl>
        </Box>

        {/* Slider for 'k' */}
        <Box sx={{ marginBottom: '16px' }}>
            <Typography variant="body1" fontSize={14}>Deroute Parameter (k)</Typography>
            <Slider
                value={k}
                onChange={(_e, value) => setK(value as number)}
                min={0.5}
                max={10}
                step={0.1}
                valueLabelDisplay="auto"
                size={'small'}
            />
        </Box>

        {/* Slider for 'd' */}
        <Box sx={{ marginBottom: '16px' }}>
            <Typography variant="body1" fontSize={14}>Edge Weight Parameter (d)</Typography>
            <Slider
                value={d}
                onChange={(_e, value) => setD(value as number)}
                min={0.5}
                max={10}
                step={0.1}
                valueLabelDisplay="auto"
                size={'small'}
            />
        </Box>

        {/* Slider for 'numSegments' */}
        <Box sx={{ marginBottom: '16px' }}>
            <Typography variant="body1" fontSize={14}>Curve Smoothness (number of segments)</Typography>
            <Slider
                value={numSegments}
                onChange={(_e, value) => setNumSegments(value as number)}
                min={10}
                max={200}
                step={1}
                valueLabelDisplay="auto"
                size={'small'}
            />
        </Box>
    </Box>
    );
  }

  export default UserControls;