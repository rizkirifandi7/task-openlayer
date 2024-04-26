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

/**
 * @file This file contains the Button component which is responsible for rendering a button.
 * @copyright Intern MSIB6 @ PT Len Industri (Persero)
 */

import PropTypes from "prop-types";

/**
 * Button component
 * @component
 * @param {Object} props - The props object
 * @param {React.ReactNode} props.children - The children nodes
 * @param {Function} props.onClick - The function to handle click events
 * @param {string} props.className - The CSS classes to apply to the button
 * @returns {JSX.Element} The rendered Button component
 */
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
