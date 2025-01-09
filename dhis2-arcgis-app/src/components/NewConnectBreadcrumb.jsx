import React from "react";
import PropTypes from "prop-types";

const Breadcrumb = ({ steps, currentStep }) => {
    return (
      <nav aria-label="breadcrumb">
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
          {steps.map((step, index) => (
            <li
              key={index}
              style={{
                marginRight: '1rem',
                textDecoration: index === currentStep ? 'underline' : 'none',
                fontWeight: index === currentStep ? 'bold' : 'normal',
              }}
            >
              {step}
            </li>
          ))}
        </ol>
      </nav>
    );
  };
  
  Breadcrumb.propTypes = {
    steps: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentStep: PropTypes.number.isRequired,
  };
  
  export default Breadcrumb;