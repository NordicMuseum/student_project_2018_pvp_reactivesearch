import React, { Component } from 'react';
import Histoslider from 'histoslider';

class ReactiveHistoslider extends Component {

  // warning it might be temting to pase state from parent. DONT it will make Histoslider chrach! 
  constructor(props) {
    super(props);
    this.state = {
      value: [0, 100] // testing sliders
    };
  }

  setValueRange = (newValue) => {
    if (!newValue) return;
    if (newValue[0] > newValue[1]) {
      let temp = newValue[0];
      newValue[0] = newValue[1];
      newValue[1] = temp + 5;
    }
    newValue[0] = Math.floor(newValue[0])
    newValue[1] = Math.floor(newValue[1])
    this.setState({ value: newValue });
  }

  updateQuery = () => {
    let gte = this.state.value[0];
    let lte = this.state.value[1];
    this.props.setQuery(
      {
        "query": {
          "nested": {
            "path": "googleVision.responses.labelAnnotations",
            "query": {
              "bool": {
                "must": {
                  "range": {
                    "googleVision.responses.labelAnnotations.score": {
                      "gte": gte,
                      "lte": lte
                    }
                  }
                }
              }
            }
          }
        }
      }
    );

    /*  this.props.setQuery(
       {
         "query": {
           "bool": {
             "must": query
           }
         }
       }
     ); */
  }

  /* 
  
        {
        "query": {
          "nested": {
            "path": "googleVision.responses.labelAnnotations",
            "query": {
              "bool": {
                "must": {
                  "range": {
                    "googleVision.responses.labelAnnotations.score": {
                      "gte": gte,
                      "lte": lte
                    }
                  }
                }
              }
            }
          }
        }
      }

  */

  render() {
    let histosliderData = [];
    let mappedHistosliderData = [];
    if (this.props.aggregations) {
      histosliderData = this.props.aggregations.labelAnnotations.inner ?
        this.props.aggregations.labelAnnotations.inner.score.buckets
        : this.props.aggregations.labelAnnotations.score.buckets;

      histosliderData.map((item) => {
        mappedHistosliderData.push({ x0: item.key, x: item.key + 5, y: item.doc_count })
      })
      //  console.log(this.props)
      return (
        <div
          onMouseUp={this.updateQuery}
        >
          <Histoslider
            style={{ margin: "auto" }}
            data={mappedHistosliderData}
            padding={20}
            width={340}
            height={120}
            selection={this.state.value}
            onChange={this.setValueRange}
          />
        </div>
      )
    }
    return null;
  }
}

export default ReactiveHistoslider;