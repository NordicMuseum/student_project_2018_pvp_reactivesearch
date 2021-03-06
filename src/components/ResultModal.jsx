import React, { Component } from 'react';
import ColorStrip from './ColorStrip'

//TODO länka till kringla via entityUri http://www.kringla.nu/kringla/objekt?referens= + raa/kmb/16000300032372

class ResultModal extends Component {

  createLabelList = (labels) => {
    return (labels.map((item, index) =>
      <div key={index} style={{ width: "300px" }}>
        <span>{item.description}</span>
        <span style={{ float: "right" }}>{item.score}</span>
      </div>
    ));
  }

  render() {

    if (!this.props.modalFields) return;


    const { description, service, image, organization, tag, context, googleVision, entityUri, itemLabel } = this.props.modalFields
    const labels = googleVision.responses[0].labelAnnotations;
    const colors = googleVision.responses[0].imagePropertiesAnnotation.dominantColors.colors;
    let motive = image.motive;
    let highres, lowres;
    let kringla = "http://www.kringla.nu/kringla/objekt?referens=" + entityUri.slice(25)

    for (let src of image.src) {
      if (src.type === 'highres') {
        highres = src.content;
        break;
      } else if (src.type === 'lowres') {
        lowres = src.content;
      }
    }

    const ksamData = [
      { label: "Item label:", text: itemLabel ? itemLabel : "-" },
      { label: "Description:", text: description ? description : "-" },
      { label: "Motive:", text: motive ? motive : "-" },
      { label: "Organization:", text: organization ? organization : "-", },
      { label: "Tags:", text: tag ? tag : "-", },
      { label: "Service:", text: service ? service : "-" },
      { label: "Name:", text: context.nameLabel ? context.nameLabel : "-" },
      { label: "Place:", text: context.placeLabel ? context.placeLabel : "-" },
      { label: "Time:", text: context.timeLabel ? context.timeLabel : "-" },
      { label: "Attribution:", text: <a href={kringla} target="_blank">Kringla.nu</a> }
    ]


    return (
      <div style={{ display: "flex", flexDirection: "row", height: "800px" }}>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
          {
            ksamData.map((row) => {
              return (
                <div key={row.label} style={{ display: "flex", flexDirection: "row", padding: "5px", fontSize: "14px" }}>
                  <div style={{ width: "150px", fontWeight: "bold" }}>{row.label}</div>
                  <div style={{ width: "100%" }}>{row.text}</div>
                </div>
              )
            })
          }
          <div style={{ padding: "5px" }}>
            <ColorStrip key={"color"} colors={colors} colorstripWidth={100} setSelectedColors={() => { console.log('Not implemented') }} />
          </div>
          <div style={{ overflowY: "auto", padding: "5px" }}>
            <div style={{ fontWeight: "bold", width: "300px", marginBottom: "20px" }}>
              <span>Label</span>
              <span style={{ float: "right" }}>Confidence</span>
            </div>
            {this.createLabelList(labels)}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <img
            alt={motive ? motive : "-"}
            style={{
              display: "block",
              maxWidth: "1000px",
              maxHeight: "750px",
              width: "auto",
              height: "auto"
            }}
            src={highres ? highres : lowres}
          />
        </div>

      </div>
    )

  }
}

export default ResultModal;