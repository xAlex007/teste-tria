import { Spinner } from "react-bootstrap"
import "./styles.scss"

export function Loading() {
  return (
    <div id="page-load">
      <Spinner animation="border" variant="info" />
    </div>
  )
}
