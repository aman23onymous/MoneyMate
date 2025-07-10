const Card = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl border border-gray-200 ${className}`}>
    {children}
  </div>
);

export default Card;
