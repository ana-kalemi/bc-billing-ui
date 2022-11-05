import baseURL from "@/libs/axios";
import { GridRowModel, AggregateColumn, ColumnStore } from '@bryntum/grid';

class Gate extends GridRowModel {
  static get fields() {
    return [
      'source', 'lineItemNumber', 'lineWorkDescription', 'lineScheduledValue', 'prevAppTotal', 'ta_value', 'ta_qty', 't_value', 't_qty', 'balance', 'retention', 'retention_amount', 'total_retention'
    ];
  }

  get t_value() {
    return this.ta_value ? this.prevAppTotal + this.ta_value : 0;
  }
  get t_qty() {
    return 100 * this.t_value / this.lineScheduledValue;
  }
  get balance() {
    return this.lineScheduledValue - this.t_value;
  }
  get retention_amount() {
    return this.retention ? this.ta_value * this.retention / 100 : this.retention = 0;
  }
  get total_retention() {
    return this.t_value * this.retention / 100;
  }
}

class CalculatedColumn extends AggregateColumn {
  static get $name() {
    return 'CalculatedColumn';
  }

  static get fields() {
    return [
      'dependentFieldsOne',
      'dependentFieldsTwo',
      'dependentFieldsThree',
      'dependentFieldsFour',
      'dependentFieldsFive',
      'dependentFieldsSix',
      'dependentFieldsSeven'
    ];
  }
}

ColumnStore.registerColumnType(CalculatedColumn, true);

export const useGridConfig = (project_id) => {
  return {
    autoHeight: true,

    store: {
      modelClass: Gate,
      readUrl: `${baseURL}&handler=billing_items&dataset=project_items&project_id=` + project_id,
      autoLoad: true
    },

    features: {
      sort: false,
      columnReorder: false,
      summary: true,
    },

    columns: [
      {
        children: [
          {
            children: [
              { field: 'source', text: 'Source', editor: false },
            ]
          },
        ]
      },
      {
        children: [
          {
            children: [
              { field: 'lineItemNumber', text: 'Line Item #', sum: 'count', summaryRenderer: () => `Total`, editor: false },
              { field: 'lineWorkDescription', text: 'Description of Work', editor: false },
              {
                type: 'number', field: 'lineScheduledValue', text: 'Scheduled Value', sum: 'sum', editor: false,
                format: {
                  minimumFractionDigits: 2
                },
              },
              {
                type: 'number', field: 'prevAppTotal', text: 'Previous Applications Total', sum: 'sum', editor: false,
                format: {
                  minimumFractionDigits: 2
                },
              },
            ]
          },
        ]
      },
      {
        id: 'work_completed',
        text: 'Work Completed',
        children: [
          {
            id: 'application',
            text: 'This Application',
            children: [
              {
                type: 'number', field: 'ta_value', text: 'Value', sum: 'sum',
                dependentFieldsOne: ['lineScheduledValue', 'ta_qty'],
                format: {
                  minimumFractionDigits: 2
                },
              },
              {
                type: 'number', field: 'ta_qty', text: '% / Qty', sum: 'sum',
                dependentFieldsTwo: ['lineScheduledValue', 'ta_value'],
                summaryRenderer: ({ sum }) => `${sum}%`,
                format: {
                  minimumFractionDigits: 2
                },
              },
            ]
          },
          {
            id: 'total',
            text: 'Total',
            children: [
              {
                id: 't_value', type: 'number', field: 't_value', text: 'Value', sum: 'sum', editor: false,
                dependentFieldsThree: ['prevAppTotal', 'ta_value'],
                format: {
                  minimumFractionDigits: 2
                },
              },
              {
                id: 't_qty', type: 'number', field: 't_qty', text: '% / Qty', sum: 'sum', summaryRenderer: ({ sum }) => `${sum}%`, editor: false,
                dependentFieldsFour: ['t_value', 'lineScheduledValue'],
                format: {
                  minimumFractionDigits: 2
                },
              },
            ]
          },
        ]
      },
      {
        children: [
          {
            children: [
              {
                id: 'balance', type: 'number', field: 'balance', text: 'Balance to Finish', width: 100, sum: 'sum', editor: false,
                dependentFieldsFive: ['lineScheduledValue', 't_value'],
                format: {
                  minimumFractionDigits: 2
                },
              },
              {
                id: 'retention', type: 'number', field: 'retention', text: 'Retentions %', width: 100, sum: 'sum', summaryRenderer: ({ sum }) => `${sum}%`,
                format: {
                  minimumFractionDigits: 2
                },
              },
              {
                id: 'retention_amount', type: 'number', field: 'retention_amount', text: 'Current Retentions Amount', width: 100, sum: 'sum', editor: false,
                dependentFieldsSix: ['ta_value', 'retention'],
                format: {
                  minimumFractionDigits: 2
                },
              },
            ]
          },
        ]
      },
      {
        children: [
          {
            children: [
              {
                id: 'total_retention', type: 'number', field: 'total_retention', text: 'Total Unbilled Retentions', sum: 'sum', width: 200, editor: false,
                dependentFieldsSeven: ['t_value', 'retention'],
                format: {
                  minimumFractionDigits: 2
                },
              }
            ]
          },
        ]
      },
    ],
    listeners: [

    ]
  };
};