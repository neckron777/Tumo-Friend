import React from "react";

import {Container, Tabs,Tab, Col, Row} from "react-bootstrap";


export default (porps) => (
    <Container fluid={true}>
        <Row>
            <Col md={{span: 6}} >
                <Tabs>
                    <Tab eventKey="Chat" title="Chat">
                    </Tab>
                </Tabs>
            </Col>
        </Row>
    </Container>
);