import React from 'react';

const ListItem = props =>
  <li class="list-group-item d-flex justify-content-between align-items-center">
    {props.label}
    <span class="badge badge-primary badge-pill">{props.probability} %</span>
  </li>;

export default ListItem;