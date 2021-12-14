import React from "react"

type Props = {
    parentCallback: (_ : File) => void;
}

// index
class FileGetter extends React.Component<Props> {
    render(): React.ReactNode {
        return <input onChange={this.handleFileSelected} type="file" accept="video/mp4,video/x-m4v,video/*" />
    }

    handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        let chosenfile = e.target.files?.[0]
        if (chosenfile === undefined) return;
        this.props.parentCallback(chosenfile)
    }
}

export default FileGetter
  