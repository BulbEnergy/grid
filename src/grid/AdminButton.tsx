import React from 'react';
import { Button } from '../shared/Button';

export interface AdminButtonProps {
  onClickHandler: () => void;
}

const AdminButton: React.FunctionComponent<AdminButtonProps> = (
  props: AdminButtonProps,
) => (
  <Button
    id="admin-button"
    onClick={(event: React.MouseEvent<HTMLElement>) => {
      props.onClickHandler();
      event.stopPropagation();
    }}
  >
    Start voting
  </Button>
);

export { AdminButton };
