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
