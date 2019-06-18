import React from 'react';

const getBadgeClass = probability => {
  if (probability > 0.6) return 'success';
  if (probability > 0.4) return 'info';
  if (probability > 0.2) return 'secondary';
  if (probability > 0.1) return 'warning';
  return 'danger';
}

const Badge = props =>
  <span className={`badge badge-${getBadgeClass(props.probability)} badge-pill`}>{props.probability} %</span>


const ListItem = props =>
  <li className="list-group-item d-flex justify-content-between align-items-center text-dark" key={props.probability}>
    {props.label}
    <Badge probability={props.probability} />
  </li>;

export default ListItem;