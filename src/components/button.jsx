/*
 * Copyright Intern MSIB6 @ PT Len Industri (Persero)
 * 
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INDUSTRI (PERSERO), AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INDUSTRI (PERSERO), NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INDUSTRI (PERSERO), AS APPLICABLE.
 * 
 * Created Date: Friday, March 22nd 2024, 9:17:40 am
 * Author: Rizki Rifani | rizkirifandi7@gmail.com <https://github.com/rizkirifandi7>
 * 
 */


import PropTypes from "prop-types";

const Button = ({ children, onClick, className }) => {
    return (
        <button
            className={`flex items-center justify-center  text-white text-2xl rounded w-8 h-8 ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node, 
    onClick: PropTypes.func,
    className: PropTypes.string,
};

export default Button;
