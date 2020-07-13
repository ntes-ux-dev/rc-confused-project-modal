import * as React from 'react'
import { Modal } from 'antd'

// eslint-disable-next-line @typescript-eslint/prefer-interface
export type ConfusedProjectModalContentItem = {
    project: string
    items: string[]
}

// eslint-disable-next-line @typescript-eslint/prefer-interface
type ConfusedProjectModalDataItem = {
    project: string
    items: { origin: string; confused: string }[]
}

export interface ConfusedProjectModalProps {
    visible?: boolean
    projects?: string[]
    excludeProjects?: string[]
    content?: ConfusedProjectModalContentItem[]
    onConfirm?: () => void
    onCancel?: () => void
}

export interface ConfusedProjectModalState {
    modalVisible: boolean
    confusedData: ConfusedProjectModalDataItem[]
}

const noop = (): void => {}

export function checkConfusedProject(
    projects: string[],
    content: ConfusedProjectModalContentItem[],
    excludeProjects = ['DEMO']
): ConfusedProjectModalDataItem[] {
    const confusedData: ConfusedProjectModalDataItem[] = []

    const list = [...projects]
        .filter((p): boolean => !excludeProjects.includes(p.toUpperCase()))
        .sort((a, b): number => b.length - a.length)

    for (const { project, items } of content) {
        const reg = new RegExp(project, 'gi')
        const rep = '_'.repeat(project.length)
        const confusedItems: { origin: string; confused: string }[] = []

        for (const item of items) {
            const s = item.toUpperCase().replace(reg, rep)

            for (const p of list) {
                if (!p) continue
                const pl = p.toUpperCase()
                const i = s.indexOf(pl)
                if (i >= 0) {
                    confusedItems.push({
                        origin: item,
                        confused: item.substr(i, p.length)
                    })
                    break
                }
            }
        }

        if (confusedItems.length) {
            confusedData.push({
                project,
                items: confusedItems
            })
        }
    }

    return confusedData
}

export default class ConfusedProjectModal extends React.Component<
    ConfusedProjectModalProps,
    ConfusedProjectModalState
> {
    constructor(props: ConfusedProjectModalProps) {
        super(props)
        this.state = {
            modalVisible: false,
            confusedData: []
        }
    }

    componentDidUpdate(prevProps: ConfusedProjectModalProps): void {
        const {
            visible,
            projects = [],
            excludeProjects,
            content = [],
            onConfirm = noop
        } = this.props
        if (!prevProps.visible && visible) {
            const data = checkConfusedProject(
                projects,
                content,
                excludeProjects
            )
            if (data.length) {
                this.setState({
                    modalVisible: true,
                    confusedData: data
                })
            } else {
                onConfirm()
            }
        }
        if (prevProps.visible && !visible) {
            this.setState({
                modalVisible: false
            })
        }
    }

    render(): React.ReactNode {
        const { onConfirm = noop, onCancel = noop } = this.props
        const { modalVisible, confusedData } = this.state

        return (
            <Modal
                title="项目冲突"
                closable={false}
                visible={modalVisible}
                onCancel={onCancel}
                onOk={onConfirm}
                width={600}
                maskClosable={false}
                cancelText="返回修改"
                okText="确认无误并提交"
            >
                <div className="rc-confused-project-container">
                    以下工作内容中，填写了与所选项目<b>冲突</b>的项目编号：
                    {confusedData.map(
                        (group, index): React.ReactNode => (
                            // eslint-disable-next-line react/no-array-index-key
                            <div key={index}>
                                <br />
                                {group.project}:
                                {group.items.map(
                                    (item): React.ReactNode => (
                                        <div key={item.origin}>
                                            <span
                                                // eslint-disable-next-line react/no-danger
                                                dangerouslySetInnerHTML={{
                                                    __html: item.origin.replace(
                                                        new RegExp(
                                                            `(${item.confused})`,
                                                            'g'
                                                        ),
                                                        '<b class="text-red">$1</b>'
                                                    )
                                                }}
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        )
                    )}
                    <br />
                    请检查是否填写错误，如有错误请更正，如正常请点击提交。
                </div>
            </Modal>
        )
    }
}
