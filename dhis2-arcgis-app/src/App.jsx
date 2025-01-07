import { useDataQuery } from '@dhis2/app-runtime';
import i18n from '@dhis2/d2-i18n';
import React from 'react';
import classes from './App.module.css';
import { setAssetPath } from "@esri/calcite-components/dist/components";
// define the custom elements on the browser
import "@esri/calcite-components/dist/components/calcite-button.js";
import "@esri/calcite-components/dist/components/calcite-icon.js";
import "@esri/calcite-components/dist/components/calcite-slider.js";
import "@esri/calcite-components/dist/calcite/calcite.css";

// import the React wrapper components
import { CalciteButton, CalciteIcon, CalciteSlider } from "@esri/calcite-components-react";

// Local assets
setAssetPath(window.location.href);

const query = {
    me: {
        resource: 'me',
    },
}

const MyApp = () => {
    const { error, loading, data } = useDataQuery(query)

    if (error) {
        return <span>{i18n.t('ERROR')}</span>
    }

    if (loading) {
        return <span>{i18n.t('Loading...')}</span>
    }

    return (
        <div className={classes.container}>
            <h1>{i18n.t('Hello {{name}}', { name: data.me.name })}</h1>
            <h3>{i18n.t('Welcome to DHIS2!')}</h3>
            <CalciteButton appearance="solid" color="blue" scale="m">
                <CalciteIcon icon="plus" scale="s" />
                {i18n.t('Add something')}
            </CalciteButton>
        </div>
    )
}

export default MyApp
