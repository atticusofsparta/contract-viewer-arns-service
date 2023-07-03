import { Button } from 'antd';

export type ContractView =
  | 'interactions'
  | 'holders'
  | 'read'
  | 'write'
  | 'source'
  | 'analytics'
  | 'comments';
export const CONTRACT_VIEWS: ContractView[] = [
  'interactions',
  'holders',
  'read',
  'write',
  'source',
  'analytics',
  'comments',
];

function ContractViewSelector({
  viewCallback,
  view,
}: {
  viewCallback: (view: ContractView) => void;
  view: ContractView;
}) {
  return (
    <div
      className="flex-row flex-start green-pattern"
      style={{
        width: '100%',
        backgroundColor: 'black',
        marginTop: '50px',
        padding: '15px',
        gap: '20px',
        boxSizing: 'border-box',
      }}
    >
      {CONTRACT_VIEWS.map((v: ContractView) => (
        <Button
          type="primary"
          style={{
            width: 'fit-content',
            height: '50px',
            backgroundColor: v === view ? 'rgb(0,0,0,.5)' : 'grey',
            flex: 1,
          }}
          onClick={() => viewCallback(v)}
        >
          {v}
        </Button>
      ))}
    </div>
  );
}

export default ContractViewSelector;
